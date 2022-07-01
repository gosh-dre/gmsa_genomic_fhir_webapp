import * as Yup from "yup";
import { Patient } from "@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient";

const requiredString = Yup.string().required();
const requiredDate = Yup.date().min("1900-01-01").required();
const boolField = Yup.boolean().default(false).nullable(false);

export const patientSchema = Yup.object({
  mrn: requiredString,
  firstName: requiredString,
  lastName: requiredString,
  dateOfBirth: requiredDate,
  gender: Yup.mixed<Patient.GenderEnum>().oneOf(Object.values(Patient.GenderEnum)),
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
  collectionDate: requiredDate,
  specimenType: requiredString,
  reasonForTestCode: requiredString,
  reasonForTestText: requiredString,
});

export type SampleSchema = Yup.InferType<typeof sampleSchema>;

const variantSchema = Yup.object({
  gene: requiredString,
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
  geneInformation: requiredString,
  reportingScientist: requiredString,
  reportingScientistTitle: requiredString,
  reportingDate: requiredDate,
  authorisingScientist: requiredString,
  authorisingScientistTitle: requiredString,
  authorisingDate: requiredDate,
  furtherTesting: requiredString,
  testMethodology: requiredString,
  clinicalConclusion: requiredString,
});

export type ReportDetailSchema = Yup.InferType<typeof reportDetailSchema>;
