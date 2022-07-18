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

const setDummyValues = (withDates: boolean) => {
  const dummyValue = "Always the same";
  const form = screen.getByRole("form");
  const textInputs = within(form).getAllByLabelText(/^((?!resultOutput|mrn|date|address|gender).)*$/i);
  textInputs.forEach((input) => clearAndType(input, dummyValue));
  if (withDates) {
    within(form)
      .getAllByLabelText(/date/i)
      .forEach((input) => {
        clearAndType(input, "2019-01-01");
      });
  }
};

function setLabAndPatient() {
  userEvent.selectOptions(screen.getByDisplayValue(/select a lab/i), ["gosh"]);
  setDummyValues(true);
  clearAndType(screen.getByLabelText(/gender/i), Patient.GenderEnum.Female);

  // set MRN value
  const newMRNValue = "10293879";
  userEvent.type(screen.getByLabelText(/mrn/i), newMRNValue);
  userEvent.tab();
  userEvent.click(screen.getByText(/next/i));
}

function setDummyAndNext(withDates: boolean) {
  setDummyValues(withDates);
  userEvent.click(screen.getByText(/next/i));
}

async function setVariantFields() {
  await act(async () => {
    userEvent.click(screen.getByText(/add a variant/i));
  });

  setDummyAndNext(false);
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

    // Act
    await act(async () => {
      setLabAndPatient();
    });
    await act(async () => {
      setDummyAndNext(true);
    });
    await act(async () => {
      setVariantFields();
    });
    await act(async () => {
      setDummyAndNext(true);
    });
    await act(async () => {
      userEvent.click(screen.getByText(/submit/i));
    });

    // Assert
    const result = await screen.findByRole("alert");
    expect(result).toBeInTheDocument();
  });
});
