import ReportForm from "./ReportForm";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Patient } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/patient";
import { noValues } from "./FormDefaults";
import { act } from "react-dom/test-utils";

const clearAndType = (element: Element, value: string) => {
  userEvent.clear(element);
  userEvent.type(element, value);
};

type DropDown = {
  field: RegExp;
  value: string;
};

const setDummyValues = (withDates: boolean, dropDowns?: DropDown[]) => {
  const dummyValue = "Always the same";
  const form = screen.getByRole("form");
  const textInputs = within(form).getAllByLabelText(
    /^((?!resultOutput|date|address|gender|specimen type|follow up).)*$/i,
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
        // swallow error if this is a drop-down field
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

async function setDummyAndNext(withDates: boolean, dropDowns?: DropDown[]) {
  await act(async () => {
    setDummyValues(withDates, dropDowns);
  });

  await act(async () => {
    userEvent.click(screen.getByText(/next/i));
  });
}

const setSample = () => {
  return setDummyAndNext(true, [
    { field: /specimen type/i, value: "122555007" },
    { field: /test reason/i, value: "230387008" },
  ]);
};

async function setVariantFields() {
  await act(async () => {
    userEvent.click(screen.getByText(/add a variant/i));
  });
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
  const dropDowns = [{ field: /Follow up/i, value: "Genetic counseling recommended" }];
  await setDummyAndNext(true, dropDowns);
};

jest.setTimeout(20000);

const variantDropDowns = [
  { field: /Zygosity/i, value: "Homozygous" },
  { field: /Inhertiance Method/i, value: "Autosomal dominant" },
  { field: /Classification$/i, value: "Pathogenic" },
];

describe("Report form", () => {
  /**
   * Given the report form
   * When all data filled in
   * Then the rendered result should be rendered in an alert box
   */
  test("Report with variant", async () => {
    // Arrange
    render(<ReportForm initialValues={noValues} />);

    // Act
    await setLabAndPatient();
    await setSample();
    await setVariantFields();
    await setReportFields();
    await act(async () => {
      userEvent.click(screen.getByText(/submit/i));
    });

    // Assert
    const result = await screen.findByRole("alert");
    expect(result).toBeInTheDocument();
  });

  /**
   * Given the report form
   * When all data filled in except for having no variant
   * Then the rendered result should be rendered in an alert box
   */
  test("Report without variant", async () => {
    // Arrange
    render(<ReportForm initialValues={noValues} />);

    // Act
    await setLabAndPatient();
    await setSample();
    await setNoVariant();
    await setReportFields();
    await act(async () => {
      userEvent.click(screen.getByText(/submit/i));
    });

    // Assert
    const result = await screen.findByRole("alert");
    expect(result).toBeInTheDocument();
  });
});
