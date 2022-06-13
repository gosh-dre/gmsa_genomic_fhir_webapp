import ReportForm from "./ReportForm";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Patient } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/patient";

const clearAndType = (element: Element, value: string) => {
  userEvent.clear(element);
  userEvent.type(element, value);
};

describe("Report form", () => {
  /**
   * Given the report form
   * When all data filled in
   * Then the rendered result should be rendered in an alert box
   */
  test("Values returned by form submission", async () => {
    // Arrange
    render(<ReportForm />);

    // Act
    // add dummy value to all fields that are not of interest
    const dummyValue = "Always the same";
    const form = screen.getByRole("form");
    const textInputs = within(form).getAllByLabelText(/^((?!resultOutput|mrn|date|address).)*$/i);
    textInputs.forEach(input => clearAndType(input, dummyValue));
    within(form).getAllByLabelText(/date/i).forEach(input => {
      clearAndType(input, "2019-01-01");
    });
    clearAndType(screen.getByLabelText(/gender/i), Patient.GenderEnum.Female);

    // set MRN value
    const newMRNValue = "10293879";
    userEvent.type(screen.getByLabelText(/mrn/i), newMRNValue);

    userEvent.click(screen.getByText(/submit/i));


    // Assert
    const result = await screen.findByRole("alert");
    expect(result).toBeInTheDocument();
  });
});
