import * as Yup from "yup";
import { Patient } from "@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient";
import { parseDateTime, today } from "../../utils/dateTime";
import moment from "moment";

const optionalString = Yup.string().optional();
const requiredString = Yup.string().required();

const date = Yup.string()
  .test("valid-date", "Please enter a valid date", (value) => !value || moment(value).isValid())
  .test("past-date", "Please enter a valid date in the past", (value) => !value || moment(value).isBefore(today));
export const requiredDate = date.required();

export const dateTime = Yup.string()
  .test("valid-date", "Please enter a valid date in DD/MM/YYYY or date time in DD/MM/YYYY HH:mm (24 hour)", (value) => {
    return !value || parseDateTime(value).isValid();
  })
  .test("past-date", "Please enter a valid date in the past", (value) => {
    return !value || parseDateTime(value).isBefore(today);
  });
export const requiredDateTime = dateTime.required();
export const optionalDateTime = dateTime.optional();

const boolField = Yup.boolean().default(false).nullable(false);

export const patientSchema = Yup.object({
  mrn: requiredString,
  firstName: requiredString,
  lastName: requiredString,
  dateOfBirth: requiredDate,
  gender: Yup.mixed<Patient.GenderEnum>()
    .oneOf(Object.values(Patient.GenderEnum))
    .test("required", "Please select an option", (value) => value !== undefined),
  familyNumber: requiredString,
});

export type PatientSchema = Yup.InferType<typeof patientSchema>;

export const addressSchema = Yup.object({
  name: requiredString,
  streetAddress: Yup.array().of(Yup.string().required()).required(),
  city: requiredString,
  postCode: requiredString,
  country: requiredString,
});

export type AddressSchema = Yup.InferType<typeof addressSchema>;

export const sampleSchema = Yup.object({
  specimenCode: requiredString,
  collectionDateTime: optionalDateTime,
  receivedDateTime: requiredDateTime,
  specimenType: requiredString,
  reasonForTest: requiredString,
  reasonForTestText: optionalString,
});

export type SampleSchema = Yup.InferType<typeof sampleSchema>;

const variantSchema = Yup.object({
  gene: requiredString,
  geneInformation: optionalString,
  transcript: requiredString,
  genomicHGVS: requiredString,
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
  clinicalConclusion: requiredString,
  citation: optionalString,
});

export type ReportDetailSchema = Yup.InferType<typeof reportDetailSchema>;
