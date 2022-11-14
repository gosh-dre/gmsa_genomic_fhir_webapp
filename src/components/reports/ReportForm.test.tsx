import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Patient } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/patient";
import { act } from "react-dom/test-utils";
import { createPractitioner, deleteFhirData, TestReportForm } from "../../fhir/testUtilities";
import { Practitioner } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/practitioner";
import { createIdentifier } from "../../fhir/resource_helpers";
import { GOSH_GENETICS_IDENTIFIER } from "../../fhir/resources";
import { BrowserRouter } from "react-router-dom";
import { mockedNavigate } from "../../setupTests";

const clearAndType = (element: Element, value: string) => {
  userEvent.clear(element);
  userEvent.type(element, value);
};

type DropDown = {
  field: RegExp;
  value: string;
};

const setDummyValues = (withDates: boolean, dropDowns?: DropDown[], multiSelect?: DropDown[]) => {
  const dummyValue = "Always_the_same";
  const form = screen.getByRole("form");

  within(form)
    .queryAllByLabelText(/nhs number/i)
    .forEach((input) => {
      clearAndType(input, "1234567890");
    });

  const textInputs = within(form).getAllByLabelText(
    /^((?!nhs number|resultOutput|date|address|gender|specimen type|search|gene symbol|follow up).)*$/i,
  );

  if (!dropDowns) {
    textInputs.forEach((input) => {
      clearAndType(input, dummyValue);
    });
  } else {
    textInputs.forEach((input) => {
      try {
        clearAndType(input, dummyValue);
      } catch (e) {
        // swallow error if this is a drop-down field and we're trying to clear it - otherwise rethrow
        const result = (e as Error).message;
        if (!result.includes("clear currently only supports input and textarea elements")) {
          throw e;
        }
      }
    });
    dropDowns.map((dd) => {
      const field = within(form).getByLabelText(dd.field);
      userEvent.selectOptions(field, dd.value);
    });
  }

  if (multiSelect) {
    multiSelect.map((singleSelect) => {
      const field = within(form).getByLabelText(singleSelect.field);
      clearAndType(field, singleSelect.value);
      userEvent.tab();
    });
  }

  if (withDates) {
    within(form)
      .queryAllByLabelText(/date/i)
      .forEach((input) => {
        clearAndType(input, "2019-01-01");
      });
    within(form)
      .queryAllByLabelText(/datetime/i)
      .forEach((input) => {
        clearAndType(input, "01/01/2019");
      });
  }
};

async function setLabAndPatient() {
  await act(async () => {
    userEvent.selectOptions(screen.getByDisplayValue(/select a lab/i), ["gosh"]);
  });

  await act(async () => {
    setDummyValues(true);
  });

  await act(async () => {
    userEvent.selectOptions(screen.getByLabelText(/gender/i), Patient.GenderEnum.Female);
  });

  await act(async () => {
    userEvent.click(screen.getByText(/next/i));
  });
}

async function setDummyAndNext(withDates: boolean, dropDowns?: DropDown[], multiSelect?: DropDown[]) {
  await act(async () => {
    setDummyValues(withDates, dropDowns, multiSelect);
  });

  await act(async () => {
    userEvent.click(screen.getByText(/next/i));
  });
}

const setSample = () => {
  return setDummyAndNext(
    true,
    [{ field: /specimen type/i, value: "122555007" }],
    [{ field: /test reason/i, value: "R59" }],
  );
};

async function setVariantFields() {
  await act(async () => {
    userEvent.click(screen.getByText(/add a variant/i));
  });
  const geneSymbol = "GNAO1 (HGNC:4389)";
  await act(async () => {
    const searchInput = screen.getByLabelText(/search/i);
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, geneSymbol);
  });

  await act(async () => {
    const symbolSelect = screen.getAllByLabelText(/^Gene Symbol$/i, {}).at(-1);
    if (symbolSelect) {
      await userEvent.click(symbolSelect);
      await userEvent.selectOptions(symbolSelect, geneSymbol);
    }
  });

  const variantDropDowns = [
    { field: /Zygosity/i, value: "Homozygous (LA6705-3)" },
    { field: /Inhertiance Method/i, value: "Autosomal dominant (LA24640-7)" },
    { field: /Classification$/i, value: "Pathogenic (LA6668-3)" },
  ];

  await act(async () => {
    await setDummyAndNext(false, variantDropDowns);
  });
}

async function setNoVariant() {
  await act(async () => {
    userEvent.click(screen.getByText(/next/i));
  });
}

const setReportFields = async () => {
  const dropDowns = [
    { field: /Follow up/i, value: "Genetic counseling recommended (LA14020-4)" },
    { field: /Report finding/i, value: "Positive (LA6576-8)" },
  ];
  await setDummyAndNext(true, dropDowns);
};

jest.setTimeout(20000);

describe("Report form", () => {
  beforeEach(() => {
    return deleteFhirData();
  });

  test("Error modal exists", async () => {
    // Arrange
    const practitioner = new Practitioner();
    practitioner.resourceType = "Practitioner";
    // Adding in duplicate identifier for tests, but also for running in front end with form defaults
    practitioner.identifier = [
      createIdentifier(`always_the_same_report_${GOSH_GENETICS_IDENTIFIER}`),
      createIdentifier(`anapietra_report_${GOSH_GENETICS_IDENTIFIER}`),
    ];

    await createPractitioner(practitioner);
    await createPractitioner(practitioner);

    // Act - breakpoint here to submit in browser and see the modal
    render(<TestReportForm />, { wrapper: BrowserRouter });
    await setLabAndPatient();
    await setSample();
    await setVariantFields();
    await setReportFields();

    await act(async () => {
      userEvent.click(screen.getByText(/submit/i));
    });

    // Assert
    await waitFor(
      () => {
        expect(screen.getByText(/error/i, { selector: "h2" })).toBeInTheDocument();
        expect(mockedNavigate).not.toBeCalled();
      },
      { timeout: 2000 },
    );
  });
  /**
   * Given the report form
   * When all data filled in
   * Then the user should be redirected and no errors should be found
   */
  test("Report with variant", async () => {
    // Arrange
    render(<TestReportForm />, { wrapper: BrowserRouter });
    // Act
    await setLabAndPatient();
    await setSample();
    await setVariantFields();
    await setReportFields();
    await act(async () => {
      userEvent.click(screen.getByText(/submit/i));
    });
    // Assert
    await waitFor(
      () => {
        expect(screen.queryByText(/error/i, { selector: "h2" })).not.toBeInTheDocument();
        expect(mockedNavigate).toBeCalled();
      },
      { timeout: 15000 },
    );
  });

  /**
   * Given the report form
   * When all data filled in except for having no variant
   * Then the user should be redirected and no errors should be found
   */
  test("Report without variant", async () => {
    // Arrange
    render(<TestReportForm />, { wrapper: BrowserRouter });
    // Act
    await setLabAndPatient();
    await setSample();
    await setNoVariant();
    await setReportFields();
    await act(async () => {
      userEvent.click(screen.getByText(/submit/i));
    });

    // Assert
    await waitFor(
      () => {
        expect(screen.queryByText(/error/i, { selector: "h2" })).not.toBeInTheDocument();
        expect(mockedNavigate).toBeCalled();
      },
      { timeout: 10000 },
    );
  });
});
