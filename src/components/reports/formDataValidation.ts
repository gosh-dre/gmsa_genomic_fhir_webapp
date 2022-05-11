import * as Yup from "yup";

const requiredString = Yup.string().required();
const requiredDate = Yup.date().min("1900-01-01").required();

export const patientSchema = Yup.object().shape({
  mrn: requiredString,
  firstName: requiredString,
  lastName: requiredString,
  dateOfBirth: requiredDate,
  gender: requiredString,
  familyNumber: requiredString,
});

export const addressSchema = Yup.object().shape({
  streetAddress: Yup.array().of(Yup.string()).required(),
  city: requiredString,
  postCode: requiredString,
  country: requiredString,
});

export const sampleSchema = Yup.object().shape({
  specimenCode: requiredString,
  collectionDate: requiredDate,
  specimenType: requiredString,
  reasonForTestCode: requiredString,
  reasonForTestText: requiredString,
});

export const variantSchema = Yup.object().shape({
  gene: requiredString,
  transcript: requiredString,
  genomicHGVS: requiredString,
  proteinHGVS: requiredString,
  zygosity: requiredString,
  classification: requiredString,
  inheritanceMethod: requiredString,
  referenceNucleotide: requiredString,
  variantNucleotide: requiredString,
  classificationEvidence: requiredString,
});

export const reportDetailSchema = Yup.object().shape({
  resultSummary: requiredString,
  reportingScientist: requiredString,
  reportingScientistTitle: requiredString,
  reportingDate: requiredDate,
  authorisingScientist: requiredString,
  authorisingScientistTitle: requiredString,
  authorisingDate: requiredDate,
  furtherTesting: requiredString,
  testMethodology: requiredString,
});
