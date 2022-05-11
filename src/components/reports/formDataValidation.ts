import * as Yup from "yup";

export const patientSchema = Yup.object().shape({
  mrn: Yup.string().required(),
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  dateOfBirth: Yup.date().required(),
  gender: Yup.string().required(),
  familyNumber: Yup.string().required(),
});

export const addressSchema = Yup.object().shape({
  streetAddress: Yup.array().of(Yup.string()),
  city: Yup.string().required(),
  postCode: Yup.string().required(),
  country: Yup.string().required(),
});

export const sampleSchema = Yup.object().shape({
  specimenCode: Yup.string().required(),
  collectionDateTime: Yup.date().required(),
  specimenType: Yup.string().required(),
  reasonForTestCode: Yup.string().required(),
  reasonForTestText: Yup.string().required(),
});

export const variantSchema = Yup.object().shape({
  gene: Yup.string().required(),
  transcript: Yup.string().required(),
  genomicHGVS: Yup.string().required(),
  proteinHGVS: Yup.string().required(),
  zygosity: Yup.string().required(),
  classification: Yup.string().required(),
  inheritanceMethod: Yup.string().required(),
  referenceNucleotide: Yup.string().required(),
  variantNucleotide: Yup.string().required(),
  classificationEvidence: Yup.string().required(),
});

export const reportDetailSchema = Yup.object().shape({
  resultSummary: Yup.string().required(),
  reportingScientist: Yup.string().required(),
  reportingScientistTitle: Yup.string().required(),
  reportingDate: Yup.string().required(),
  authorisingScientist: Yup.string().required(),
  authorisingScientistTitle: Yup.string().required(),
  authorisingDate: Yup.string().required(),
  furtherTesting: Yup.string().required(),
  testMethodology: Yup.string()
});
