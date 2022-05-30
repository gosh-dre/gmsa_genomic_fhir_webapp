import {addressSchema, patientSchema} from "../components/reports/formDataValidation";
import {Patient} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/patient";
import {v4 as uuidv4} from "uuid";
import {Identifier} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/identifier";
import {Organization} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/organization";
import {Narrative} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/narrative";

const makeGoshAssigner = (valueType: string) => {
  return {use: Identifier.UseEnum.Official, assigner: {display: `GOSH ${valueType}`}}
}

function generatedNarrative(...parts: string[]) {
  return {status: Narrative.StatusEnum.Generated, div: `${parts.join(" ")} from FHIR genomics app`};
}

export const GOSH_GENETICS_IDENTIFIER = "gosh-genomics-fbf63df8-947b-4040-82bb-41fcacbe8bad";

/**
 * Create a FHIR patient object from form data
 * @param form patient data
 * @param organisationId uuid for the organisation
 */
export const createPatientEntry = (form: typeof patientSchema, organisationId: string) => {
  const patient = new Patient();
  patient.id = uuidv4();
  patient.name = [{family: form.lastName, given: [form.firstName]}];
  patient.identifier = [
    {value: form.mrn, ...makeGoshAssigner("MRN")},
    // implementing GOSH's structure, they chose this to represent a family as it doesn't exist in the specification
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
  patient.text = generatedNarrative(form.firstName, form.lastName);
  patient.resourceType = "Patient";
  patient.managingOrganization = {
    type: "Organization",
    reference: `Organization/${organisationId}`
  }
  return patient;
};

export const createOrganisationEntry = (form: typeof addressSchema) => {
  const org = new Organization();
  org.id = uuidv4();
  org.identifier = [{value: GOSH_GENETICS_IDENTIFIER}];
  org.resourceType = "Organization";
  org.active = true;
  org.type = [{
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/organization-type",
      "code": "prov",
      "display": "Healthcare Provider"
    }],
    "text": "Healthcare Provider"
  }];
  org.name = form.name;
  org.address = [{
    line: form.streetAddress,
    city: form.city,
    postalCode: form.postalCode,
    country: form.country,
  }];
  org.text = generatedNarrative(form.name);

  return org;
}
