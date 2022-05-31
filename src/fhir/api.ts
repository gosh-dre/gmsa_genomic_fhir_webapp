import {Resource} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";
import {FormValues} from "../components/reports/ReportForm";
import {
  organisationAndId,
  patientAndId,
  practitionersAndIds,
  specimenAndId,
  variantAndId,
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
  const org = organisationAndId(form.address);
  const patient = patientAndId(form.patient, org.identifier);
  const specimen = specimenAndId(form.sample, patient.identifier);

  const {authoriser, reporter} = practitionersAndIds(form.result);
  const variant = variantAndId(form.variant, specimen.id, specimen.identifier, reporter.id, authoriser.id);

  return {
    resourceType: "Bundle",
    type: "transaction",
    entry: [
      createEntry(patient.resource, form.patient.mrn),
      createEntry(org.resource, org.identifier),
      createEntry(specimen.resource, specimen.identifier),
      createEntry(authoriser.resource),
      createEntry(reporter.resource),
      createEntry(variant.resource, variant.identifier),
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
    requestInfo = {method: "PUT", url: `${resource.resourceType}?identifier=${identifier}`}
  }

  return {
    resource: resource, resourceType: resource.resourceType,
    request: requestInfo,
  }
}
