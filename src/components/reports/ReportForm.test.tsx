import ReportForm from "./ReportForm";
import {render, screen, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";


describe("Report form", () => {
  /**
   * Given the report form
   * When all data filled in, with a specific MRN
   * Then the rendered result should be a json object with MRN being defined
   */
  test('Values returned by form submission', async () => {
    // Arrange
    render(<ReportForm/>);

    // Act
    // add dummy value to all fields that are not of interest
    const dummyValue = "Always the same";
    const form = screen.getByRole("form");
    const textInputs = within(form).getAllByLabelText(/^((?!resultOutput|mrn|date|address).)*$/i);
    textInputs.forEach(input => userEvent.type(input, dummyValue));

    within(form).getAllByLabelText(/date/i).forEach(input => {
      userEvent.type(input, "2019-01-01")
    })

    // set MRN value
    const newMRNValue = "10293879";
    userEvent.type(screen.getByLabelText(/mrn/i), newMRNValue);

    userEvent.click(screen.getByText(/submit/i));


    // Assert
    const expectedValue = `"mrn": "${newMRNValue}"`
    const result = await screen.findByRole('alert')
    expect(result).toBeInTheDocument();
    expect(result).toHaveTextContent(expectedValue);
  });
});
