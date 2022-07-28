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
    setDummyValues(true);
    clearAndType(screen.getByLabelText(/gender/i), Patient.GenderEnum.Female);

    // set MRN value
    const newMRNValue = "10293879";
    userEvent.type(screen.getByLabelText(/mrn/i), newMRNValue);
    userEvent.tab();
    userEvent.click(screen.getByText(/next/i));
  });
}

async function setDummyAndNext(withDates: boolean) {
  await act(async () => {
    setDummyValues(withDates);
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
    await setDummyAndNext(true);
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
    await setDummyAndNext(true);
    await act(async () => {
      userEvent.click(screen.getByText(/submit/i));
    });

    // Assert
    const result = await screen.findByRole("alert");
    expect(result).toBeInTheDocument();
  });
});
