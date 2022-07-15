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
  const form = screen.getByRole("form");
  const dummyValue = "Always the same";
  const textInputs = within(form).getAllByLabelText(/^((?!resultOutput|mrn|date|address).)*$/i);
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

function setLabAndPatient() {
  setDummyValues(true);
  userEvent.selectOptions(screen.getByDisplayValue(/select a lab/i), "gosh");
  clearAndType(screen.getByLabelText(/gender/i), Patient.GenderEnum.Female);

  // set MRN value
  const newMRNValue = "10293879";
  userEvent.type(screen.getByLabelText(/mrn/i), newMRNValue);
  userEvent.click(screen.getByText(/next/i));
  userEvent.click(screen.getByText(/next/i));
}

function setDummyAndNext(withDates: boolean, dropDowns?: DropDown[]) {
  setDummyValues(withDates, dropDowns);
  userEvent.click(screen.getByText(/next/i));
}

describe("Report form", () => {
  /**
   * Given the report form
   * When all data filled in
   * Then the rendered result should be rendered in an alert box
   */
  test("Values returned by form submission", async () => {
    // Arrange
    render(<ReportForm initialValues={noValues} />);
    const variantDropDowns = [
      { field: /Zygosity/i, value: "Homozygous" },
      { field: /Inhertiance Method/i, value: "Autosomal dominant" },
      { field: /Classification$/i, value: "Pathogenic" },
    ];

    // Act
    act(() => {
      setLabAndPatient();
      setDummyAndNext(true);
      setDummyAndNext(false, variantDropDowns);
      setDummyAndNext(true);
      userEvent.click(screen.getByText(/submit/i));
    });

    // Assert
    const result = await screen.findByRole("alert");
    expect(result).toBeInTheDocument();
  });
});
