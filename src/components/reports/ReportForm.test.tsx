import ReportForm from "./ReportForm";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Patient } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/patient";
import { noValues } from "./FormDefaults";

const typeInput = (element: Element, value: string) => {
  userEvent.type(element, value);
};

const setDummyValues = (withDates: boolean) => {
  const dummyValue = "Always the same";
  const form = screen.getByRole("form");
  const textInputs = within(form).getAllByLabelText(/^((?!resultOutput|mrn|date|address).)*$/i);
  textInputs.forEach((input) => typeInput(input, dummyValue));
  if (withDates) {
    within(form)
      .getAllByLabelText(/date/i)
      .forEach((input) => {
        typeInput(input, "2019-01-01");
      });
  }
};

function setLabAndPatient() {
  userEvent.selectOptions(screen.getByDisplayValue(/select a lab/i), ["gosh"]);
  setDummyValues(true);
  typeInput(screen.getByLabelText(/gender/i), Patient.GenderEnum.Female);

  // set MRN value
  const newMRNValue = "10293879";
  userEvent.type(screen.getByLabelText(/mrn/i), newMRNValue);
  userEvent.click(screen.getByText(/next/i));
}

function setDummyAndNext(withDates: boolean) {
  setDummyValues(withDates);
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

    // Act    // set
    setLabAndPatient();
    setDummyAndNext(true);
    setDummyAndNext(false);
    setDummyAndNext(true);
    userEvent.click(screen.getByText(/submit/i));

    // Assert
    const result = await screen.findByRole("alert");
    expect(result).toBeInTheDocument();
  });
});
