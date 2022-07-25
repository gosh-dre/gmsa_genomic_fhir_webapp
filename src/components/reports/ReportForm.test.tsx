import ReportForm from "./ReportForm";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Patient } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/patient";
import { noValues } from "./FormDefaults";
import { act } from "react-dom/test-utils";

const typeInput = (element: Element, value: string) => {
  userEvent.type(element, value);
};

const clearAndType = (element: Element, value: string) => {
  userEvent.type(element, value);
  userEvent.clear(element);
};

type DropDown = {
  field: RegExp;
  value: string;
};

const setDummyValues = (withDates: boolean, dropDowns?: DropDown[]) => {
  const dummyValue = "Always the same";
  const form = screen.getByRole("form");
  const textInputs = within(form).getAllByLabelText(/^((?!resultOutput|mrn|date|address|gender).)*$/i);
  textInputs.forEach((input) => typeInput(input, dummyValue));
  if (withDates) {
    within(form)
      .getAllByLabelText(/date/i)
      .forEach((input) => {
        clearAndType(input, "2019-01-01");
      });
  }

  if (dropDowns) {
    dropDowns.map((dd) => {
      const field = within(form).getByLabelText(dd.field);
      userEvent.selectOptions(field, dd.value);
    });
  }
};

async function setLabAndPatient() {
  await act(async () => {
    setDummyValues(true);
    userEvent.selectOptions(screen.getByDisplayValue(/select a lab/i), ["gosh"]);
    clearAndType(screen.getByLabelText(/gender/i), Patient.GenderEnum.Female);

    // set MRN value
    const newMRNValue = "10293879";
    userEvent.type(screen.getByLabelText(/mrn/i), newMRNValue);
    userEvent.tab();
    userEvent.click(screen.getByText(/next/i));
  });
}

async function setDummyAndNext(withDates: boolean, dropDowns?: DropDown[]) {
  await act(async () => {
    setDummyValues(withDates, dropDowns);
    userEvent.click(screen.getByText(/next/i));
  });
}

async function setVariantFields() {
  await act(async () => {
    userEvent.click(screen.getByText(/add a variant/i));
  });
  await act(async () => {
    setDummyAndNext(false);
  });
}

async function setNoVariant() {
  await act(async () => {
    userEvent.click(screen.getByText(/next/i));
  });
}

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
    await setDummyAndNext(true);
    await setVariantFields();
    await setDummyAndNext(true, variantDropDowns);
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
    await setDummyAndNext(true);
    await setNoVariant();
    await setDummyAndNext(true, variantDropDowns);
    await act(async () => {
      userEvent.click(screen.getByText(/submit/i));
    });

    // Assert
    const result = await screen.findByRole("alert");
    expect(result).toBeInTheDocument();
  });
});
