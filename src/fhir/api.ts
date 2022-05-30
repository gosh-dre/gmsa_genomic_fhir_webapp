import {addressSchema, patientSchema} from "../components/reports/formDataValidation";
import {GOSH_GENETICS_IDENTIFIER, organisationEntry, patientEntry} from "./resources";

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
  const orgResource = organisationEntry(orgForm);
  const patientResource = patientEntry(patient, orgResource.id as string);


  return {
    resourceType: "Bundle",
    type: "transaction",
    entry: [
      {
        resource: patientResource,
        resourceType: "Patient",
        request: {method: "PUT", url: `Patient?identifier=${patient.mrn}`}
      },
      {
        resource: orgResource,
        resourceType: "Organization",
        request: {method: "PUT", url: `Organization?identifier=${GOSH_GENETICS_IDENTIFIER}`}
      }
    ]
  };
}

