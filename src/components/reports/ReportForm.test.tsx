import ReportForm from "./ReportForm";
import {fireEvent, render, screen, within} from "@testing-library/react";


describe("Report form", () => {
  test('Values returned by submission', async () => {
    // Arrange
    render(<ReportForm/>);

    // Act
    // for all fields in the form except for MRN and result, set dummy value for submission
    const defaultFieldValue = "2020-01-01";
    const form = screen.getByRole("form");
    const inputs = within(form).getAllByLabelText(/^((?!result|mrn).)*$/i);
    inputs.map(input => fireEvent.change(input, {target: {value: defaultFieldValue}}));

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
