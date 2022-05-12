import ReportForm from "./ReportForm";
import {fireEvent, render, screen, within} from "@testing-library/react";


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
    textInputs.forEach(input => fireEvent.change(input, {target: {value: dummyValue}}));
    within(form).getAllByLabelText(/date/i).forEach(input => {
      fireEvent.change(input, {target: {value: "2019-01-01"}})
    })

    // set MRN value
    const newMRNValue = "10293879";
    fireEvent.change(screen.getByLabelText(/mrn/i), {
      target: {
        value: newMRNValue
      }
    });

    fireEvent.click(screen.getByText(/submit/i));


    // Assert
    const expectedValue = `"mrn": "${newMRNValue}"`
    const result = await screen.findByRole('alert')
    expect(result).toBeInTheDocument();
    expect(result).toHaveTextContent(expectedValue);
  });
});
