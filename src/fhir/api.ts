import {Resource} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";
import {FormValues} from "../components/reports/ReportForm";
import {
  GOSH_GENETICS_IDENTIFIER,
  organisationEntry,
  patientEntry,
  practitionerEntries,
  specimenEntry
} from "./resources";

/**
 * Create a report bundle
 * @param form values from the front end form
 */
export const bundleRequest = (form: FormValues) => {
  return {
    url: "/",
    method: "POST",
    headers: {'Content-Type': 'application/fhir+json;charset=UTF-8'},
    body: JSON.stringify(createBundle(form)),
  };
}

export const createBundle = (form: FormValues) => {
  const orgResource = organisationEntry(form.address);
  const patientResource = patientEntry(form.patient, orgResource.id as string);
  const specimenResource = specimenEntry(form.sample, patientResource.id as string);

  const specimenIdentifier = specimenResource?.identifier?.find(id => id.value)?.value;
  if (specimenIdentifier === undefined) {
    throw new TypeError("Specimen has no identifier");
  }

  const scientists = practitionerEntries(form.result);

  return {
    resourceType: "Bundle",
    type: "transaction",
    entry: [
      createEntry(patientResource, form.patient.mrn),
      createEntry(orgResource, GOSH_GENETICS_IDENTIFIER),
      createEntry(specimenResource, specimenIdentifier),
      createEntry(scientists.authoriser),
      createEntry(scientists.reporter),
    ]
  };
}

/**
 * Create individual entry for a bundle.
 *
 * If identifier is given then the method will be update or create, otherwise only create.
 * @param resource resource to send
 * @param identifier identifier used to query on (update if exists or create if not)
 */
const createEntry = (resource: Resource, identifier?: string) => {
  let requestInfo = {method: "POST", url: resource.resourceType}
  if (identifier !== undefined) {
    requestInfo = {method: "PUT", url: `resourceType?identifier=${identifier}`}
  }

  return {
    resource: resource, resourceType: resource.resourceType,
    request: requestInfo,
  }
}
