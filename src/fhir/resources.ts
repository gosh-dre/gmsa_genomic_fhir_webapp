import {patientSchema} from "../components/reports/formDataValidation";
import {Patient} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/patient";
import {v4 as uuidv4} from "uuid";
import {Identifier} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/identifier";

const makeGoshAssigner = (valueType: string) => {
  return {use: Identifier.UseEnum.Official, assigner: {display: `GOSH ${valueType}`}}
}

/**
 * Create a FHIR patient object from form data
 * @param form
 */
export const createPatientEntry = (form: typeof patientSchema) => {
  const patient = new Patient();
  patient.id = uuidv4();
  patient.name = [{family: form.lastName, given: [form.firstName]}];
  patient.identifier = [
    {value: form.mrn, ...makeGoshAssigner("MRN")},
    // implementing GOSH's structure, will ask in meeting if we should add use and assigner details
    {
      extension: [{
        url: "https://fhir.nhs.uk/R4/StructureDefinition/Extension-UKCore-NHSNumberVerificationStatus",
        valueCodeableConcept: {
          coding: [{
            system: "https://fhir.nhs.uk/R4/CodeSystem/UKCore-NHSNumberVerificationStatus",
            code: form.familyNumber,
            display: "Family Number"
          }]
        }
      }]
    }];
  patient.birthDate = form.dateOfBirth;
  patient.text = {status: "generated", div: `${form.firstName} ${form.lastName}`};
  patient.resourceType = "Patient";
  return patient;
};
