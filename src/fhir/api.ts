import {BundleEntry, Resource} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";
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
      createEntry(patientResource, patient.mrn),
      createEntry(orgResource, GOSH_GENETICS_IDENTIFIER),
    ]
  };
}

/**
 * Create individual entry for a bundle.
 * @param resource resource to send
 * @param identifier identifier used to query on (update if exists or create if not)
 */
const createEntry = (resource: Resource, identifier: string) => {
  return {
    resource: resource, resourceType: resource.resourceType,
    request: {method: "PUT", url: `resourceType?identifier=${identifier}`}
  }
}
