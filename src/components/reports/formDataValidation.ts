import * as Yup from "yup";
import { Patient } from "@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient";
import { parseDateTime, today } from "../../utils/dateTime";
import { DateTime, Interval } from "luxon";

const optionalString = Yup.string().optional();
const requiredString = Yup.string().required("This is a required field");

const date = Yup.string()
  .test("valid-date", "Please enter a valid date", (value) => !value || DateTime.fromISO(value).isValid)
  .test(
    "past-date",
    "Please enter a valid date in the past",
    (value) => !value || Interval.fromDateTimes(DateTime.fromISO(value), today).isValid,
  );
export const requiredDate = date.required("This is a required field");

export const dateTime = Yup.string()
  .test("valid-date", "Please enter a valid date in DD/MM/YYYY or date time in DD/MM/YYYY HH:mm (24 hour)", (value) => {
    return !value || parseDateTime(value).isValid;
  })
  .test("past-date", "Please enter a valid date in the past", (value) => {
    return !value || Interval.fromDateTimes(parseDateTime(value), today).isValid;
  });
export const requiredDateTime = dateTime.required();
export const optionalDateTime = dateTime.optional();

const boolField = Yup.boolean().default(false).nullable(false);

export const patientSchema = Yup.object({
  firstName: requiredString,
  lastName: requiredString,
  dateOfBirth: requiredDate,
  mrn: optionalString.test("nhs_or_mrn", "an NHS number or a MRN is required", (value, { parent }) => {
    return value || parent.nhsNumber;
  }),
  nhsNumber: optionalString
    .transform((value) => value.replace(/\s+/g, ""))
    .test(
      "nhs_number_format",
      "NHS number should have 10 digits",
      (value) => value === undefined || (value.length === 10 && !isNaN(+value)),
    )
    .test("nhs_or_mrn", "an NHS number or a MRN is required", (value, { parent }) => {
      return value || parent.mrn;
    }),
  familyNumber: optionalString,
  gender: Yup.mixed<Patient.GenderEnum>()
    .oneOf(Object.values(Patient.GenderEnum))
    .test("required", "Please select an option", (value) => value !== undefined),
});

export type PatientSchema = Yup.InferType<typeof patientSchema>;

export const addressSchema = Yup.object({
  name: requiredString,
  streetAddress: requiredString,
  city: requiredString,
  postCode: requiredString,
  country: requiredString,
});

export type AddressSchema = Yup.InferType<typeof addressSchema>;

export const sampleSchema = Yup.object({
  specimenCode: requiredString,
  collectionDateTime: optionalDateTime,
  receivedDateTime: requiredDateTime,
  authorisedDateTime: optionalDateTime,
  specimenType: requiredString,
  reasonForTest: requiredString,
  reasonForTestText: optionalString,
});

export type SampleSchema = Yup.InferType<typeof sampleSchema>;

const variantSchema = Yup.object({
  gene: requiredString,
  geneInformation: optionalString,
  transcript: requiredString,
  cDnaHgvs: requiredString,
  proteinHGVS: requiredString,
  zygosity: requiredString,
  classification: requiredString,
  inheritanceMethod: requiredString,
  classificationEvidence: requiredString,
  confirmedVariant: boolField,
  comment: requiredString,
});

export type VariantSchema = Yup.InferType<typeof variantSchema>;

export const variantsSchema = Yup.array().of(variantSchema);

export const reportDetailSchema = Yup.object({
  resultSummary: requiredString,
  reportingScientist: requiredString,
  reportingScientistTitle: requiredString,
  reportingDate: requiredDate,
  authorisingScientist: requiredString,
  authorisingScientistTitle: requiredString,
  authorisingDate: requiredDate,
  followUp: optionalString,
  furtherTesting: requiredString,
  testMethodology: requiredString,
  genesTested: requiredString,
  clinicalConclusion: requiredString,
  citation: optionalString,
  reportFinding: requiredString,
});

export type ReportDetailSchema = Yup.InferType<typeof reportDetailSchema>;
