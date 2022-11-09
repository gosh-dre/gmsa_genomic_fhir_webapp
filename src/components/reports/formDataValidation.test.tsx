import { optionalDateTime, patientSchema, requiredDate, requiredDateTime } from "./formDataValidation";
import * as Yup from "yup";
import { ValidationError } from "yup";
import { Patient } from "@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient";

const requiredSchema = Yup.object({
  requiredDate: requiredDate,
  requiredDateTime: requiredDateTime,
}).required();

const optionalSchema = Yup.object({
  optionalDateTime: optionalDateTime,
}).required();

const validDate = "2020-01-01";
const validLocalDate = "01/01/2020";
const validDateTime = "01/01/2020 12:00";

describe("Custom form validation", () => {
  test.each([
    ["dates", validDate, validLocalDate],
    ["date and datetime", validDate, validDateTime],
  ])("Required '%s' pass validation", async (description: string, date: string, datetime: string) => {
    const model = { requiredDate: date, requiredDateTime: datetime };
    const validation = await requiredSchema.validate(model);
    expect(validation).toBeTruthy();
  });

  test.each([
    ["invalid date", "20-01-01", validLocalDate],
    ["invalid datetime format", validDate, "2020-20-01 12:00"],
    ["datetime missing digit", validDate, "1/01/1900 12:00"],
    ["datetime missing all zeros", validDate, "1/1/19 12"],
    ["undefined", undefined, undefined],
    ["empty", "", ""],
    ["datetime missing all zeros", validDate, "1/1/19 12"],
    ["future date", "2100-01-01", validLocalDate],
    ["future datetime", validDate, "01/01/2100 12:00"],
  ])("Required '%s' fails validation", async (description: string, date?: string, datetime?: string) => {
    const validateModel = async () => {
      const model = { requiredDate: date, requiredDateTime: datetime };
      await requiredSchema.validate(model);
    };

    await expect(validateModel).rejects.toThrow(ValidationError);
  });

  test.each([
    ["empty", ""],
    ["undefined", undefined],
  ])("Optional '%s' pass validation", async (description: string, datetime?: string) => {
    const model = { optionalDateTime: datetime };
    const validation = await optionalSchema.validate(model);
    expect(validation).toBeTruthy();
  });

  test("mrn and NHS number can't both be empty", async () => {
    async function validateModel() {
      const model = {
        firstName: "requiredString",
        lastName: "requiredString",
        dateOfBirth: validDate,
        mrn: "",
        nhsNumber: "",
        familyNumber: "optionalString",
        gender: Patient.GenderEnum.Female,
      };
      await patientSchema.validate(model);
    }
    await expect(validateModel).rejects.toThrow(ValidationError);
  });
});
