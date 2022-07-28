import * as Yup from "yup";
import { Patient } from "@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient";
import isValid from "date-fns/isValid";
import isBefore from "date-fns/isBefore";
import { isMatch } from "date-fns";
import parseIsoDate from "yup/lib/util/isodate";
import { dateOrDatetimeFormat, parseDateTime, today } from "../../utils/dateTime";

const requiredString = Yup.string().required();
export const requiredDate = Yup.string()
  .test("valid-date", "Please enter a valid date", (value) => !isValid(value))
  .test("past-date", "Please enter a valid date in the past", (value) => isBefore(parseIsoDate(value), today))
  .required();

export const requiredDateTime = Yup.string()
  .test("valid-date", "Please enter a valid date in dd/MM/yyyy or date time in dd/MM/yyyy HH:mm (24 hour)", (value) => {
    if (!value) {
      return false;
    }
    // date-dns match is a bit liberal with missing digits which causes problems when sending to fhir API
    // so check that the length of the value is the date or datetime format as well
    return [10, 16].includes(value.length) && isMatch(value, dateOrDatetimeFormat(value));
  })
  .test("past-date", "Please enter a valid date in the past", (value) => {
    if (!value) {
      return false;
    }

    return isBefore(parseDateTime(value), today);
  })
  .required();

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
  collectionDateTime: requiredDateTime,
  receivedDateTime: requiredDateTime,
  specimenType: requiredString,
  reasonForTestCode: requiredString,
  reasonForTestText: requiredString,
});

export type SampleSchema = Yup.InferType<typeof sampleSchema>;

const variantSchema = Yup.object({
  gene: requiredString,
  geneInformation: requiredString,
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
  furtherTesting: requiredString,
  testMethodology: requiredString,
  clinicalConclusion: requiredString,
  citation: requiredString,
});

export type ReportDetailSchema = Yup.InferType<typeof reportDetailSchema>;
