import {addressSchema, patientSchema} from "../components/reports/formDataValidation";
import {createOrganisationEntry, createPatientEntry, GOSH_GENETICS_IDENTIFIER} from "./resources";

/**
 * Create a report bundle
 * @param patient FHIR patient entity
 * @param org FHIR organisation entity
 */
export const bundleRequest = (patient: typeof patientSchema, org: typeof addressSchema) => {
  return {
    url: "/",
    method: "POST",
    headers: {'Content-Type': 'application/fhir+json;charset=UTF-8'},
    body: JSON.stringify(createBundle(patient, org)),
  };
}

export const createBundle = (patient: typeof patientSchema, orgForm: typeof addressSchema) => {
  const orgEntry = createOrganisationEntry(orgForm);
  const patientEntry = createPatientEntry(patient, orgEntry.id as string);


  return {
    resourceType: "Bundle",
    type: "transaction",
    entry: [
      {
        resource: patientEntry,
        resourceType: "Patient",
        request: {method: "PUT", url: `Patient?identifier=${patient.mrn}`}
      },
      {
        resource: orgEntry,
        resourceType: "Organization",
        request: {method: "PUT", url: `Organization?identifier=${GOSH_GENETICS_IDENTIFIER}`}
      }
    ]
  };
}

