import * as Yup from "yup";
import {Patient} from "@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient";

const requiredString = Yup.string().required();
const requiredDate = Yup.date().min("1900-01-01").required();
const boolField = Yup.boolean().default(false).nullable(false);

export const patientSchema = Yup.object().shape({
  mrn: requiredString,
  firstName: requiredString,
  lastName: requiredString,
  dateOfBirth: requiredDate,
  gender: Yup.mixed<Patient.GenderEnum>().oneOf(Object.values(Patient.GenderEnum)),
  familyNumber: requiredString,
}).required();

export const addressSchema = Yup.object().shape({
  name: requiredString,
  streetAddress: Yup.array().of(Yup.string()).required(),
  city: requiredString,
  postCode: requiredString,
  country: requiredString,
}).required();

export const sampleSchema = Yup.object().shape({
  specimenCode: requiredString,
  collectionDate: requiredDate,
  specimenType: requiredString,
  reasonForTestCode: requiredString,
  reasonForTestText: requiredString,
}).required();

export const variantSchema = Yup.object().shape({
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
}).required();

export const reportDetailSchema = Yup.object().shape({
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
}).required();
