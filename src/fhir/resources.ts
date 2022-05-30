import {addressSchema, patientSchema, sampleSchema} from "../components/reports/formDataValidation";
import {v4 as uuidv4} from "uuid";
import {
  Organization,
  Patient,
  ServiceRequest,
  Specimen,
} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";
import {generatedNarrative, makeGoshAssigner, reference} from "./resource_helpers";

export const GOSH_GENETICS_IDENTIFIER = "gosh-genomics-fbf63df8-947b-4040-82bb-41fcacbe8bad";

/**
 * Create a FHIR patient object from form data
 * @param form patient data
 * @param organisationId uuid for the organisation
 */
export const patientEntry = (form: typeof patientSchema, organisationId: string) => {
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
  patient.managingOrganization = reference("Organization", organisationId);
  return patient;
};

export const organisationEntry = (form: typeof addressSchema) => {
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

/**
 * Create specimen resource from form data and link it to the patient.
 * @param sample form data
 * @param patientId to link the specimen with
 */
export const specimenEntry = (sample: typeof sampleSchema, patientId: string) => {
  const specimen = new Specimen();
  specimen.id = uuidv4();
  specimen.resourceType = "Specimen";
  specimen.collection = {collectedDateTime: sample.collectionDate};
  specimen.identifier = [{value: sample.specimenCode, id: "specimenId"}];
  specimen.type = {
    coding: [{
      system: "http://snomed.info/sct",
      code: "122555007",
      display: "Venus blood specimen",
    }]
  };
  specimen.subject = reference("Patient", patientId);

  return specimen;
}

/**
 * Create a service request resource from form data and dependent references.
 * @param sample form data for sample
 * @param patientId id for Patient
 * @param planId id for PlanDefinition
 * @param practitionerId Practitioner Id for the reporting scientist
 * @param specimenId
 */
export const serviceRequestEntry = (
  sample: typeof sampleSchema, patientId: string, planId: string, practitionerId: string, specimenId: string
) => {
  const request = new ServiceRequest();
  request.resourceType = "ServiceRequest";
  request.id = uuidv4();
  request.meta = {profile: ["http://hl7.org/fhir/StructureDefinition/servicerequest"]};
  request.text = generatedNarrative("Lab Procedure");
  request.instantiatesCanonical = [`PlanDefinition/${planId}`];
  request.status = "active";
  request.intent = "order";
  request.category = [{
    coding: [{
      system: "http://snomed.info/sct",
      code: "108252007",
      display: "Laboratory procedure",
    }]
  }];
  request.subject = reference("Patient", patientId);
  request.performerType = {
    coding: [{
      system: "http://snomed.info/sct",
      code: "310049001",
      display: "Clinical genetics service",
    }]
  }
  request.performer = [reference("Practitioner", practitionerId)];
  request.reasonCode = [{
    coding: [{
      // hardcoded for now, but have issue to pull this through from clinial APIs
      system: "http://snomed.info/sct",
      code: sample.reasonForTestCode,
      display: "Reason for recommending early-onset benign childhood occipita epilepsy",
    }],
    text: sample.reasonForTestText
  }];
  request.specimen = [reference("Specimen", specimenId)];

  return request;
}
