import ReportForm from "./ReportForm";
import {fireEvent, render, screen} from "@testing-library/react";


describe("Report form", () => {
  test('Values returned by submission', async () => {
    // Arrange
    render(<ReportForm/>);
    const newMRNValue = "10293879";
    // Act
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
