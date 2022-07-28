import { requiredDate, requiredDateTime } from "./formDataValidation";
import * as Yup from "yup";
import { ValidationError } from "yup";

const testSchema = Yup.object({
  requiredDate: requiredDate,
  requiredDateTime: requiredDateTime,
}).required();

const validDate = "2020-01-01";
const validLocalDate = "01/01/2020";
const validDateTime = "01/01/2020 12:00";

describe("Custom form validation", () => {
  test.each([
    ["dates", validDate, validLocalDate],
    ["date and datetime", validDate, validDateTime],
  ])("Valid '%s' pass validation", async (description: string, date: string, datetime: string) => {
    const model = { requiredDate: date, requiredDateTime: datetime };
    const validation = await testSchema.validate(model);
    expect(validation).toBeTruthy();
  });

  test.each([
    ["invalid date", "20-01-01", validLocalDate],
    ["invalid datetime", validDate, "2020-50-01 12:00"],
    ["future date", "2100-01-01", validLocalDate],
    ["future datetime", validDate, "01/01/2100 12:00"],
  ])("'%s' fails validation", async (description: string, date: string, datetime: string) => {
    const validateModel = async () => {
      const model = { requiredDate: date, requiredDateTime: datetime };
      await testSchema.validate(model);
    };

    await expect(validateModel).rejects.toThrow(ValidationError);
  });
});
