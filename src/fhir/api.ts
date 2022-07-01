import { Resource } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";
import { FormValues } from "../components/reports/ReportForm";
import {
  createNullVariantAndId,
  furtherTestingAndId,
  organisationAndId,
  patientAndId,
  planDefinitionAndId,
  practitionersAndIds,
  reportAndId,
  ResourceAndIds,
  serviceRequestAndId,
  specimenAndId,
  variantAndId,
} from "./resources";
import { VariantSchema } from "../components/reports/formDataValidation";

/**
 * Create a report bundle
 * @param form values from the front end form
 */
export const bundleRequest = (form: FormValues) => {
  return {
    url: "/",
    method: "POST",
    headers: { "Content-Type": "application/fhir+json;charset=UTF-8" },
    body: JSON.stringify(createBundle(form)),
  };
};

export const createBundle = (form: FormValues) => {
  const org = organisationAndId(form.address);
  const patient = patientAndId(form.patient, org.id);
  const specimen = specimenAndId(form.sample, patient.id);
  const furtherTesting = furtherTestingAndId(form.result, patient.id);
  const plan = planDefinitionAndId(form.sample, form.result, patient.id);
  const { authoriser, reporter } = practitionersAndIds(form.result);
  let variants: ResourceAndIds[];
  if (form.variant.length) {
    variants = form.variant.map((variant: VariantSchema) =>
      variantAndId(variant, patient.id, specimen.id, specimen.identifier, reporter.id, authoriser.id),
    );
  } else {
    variants = [createNullVariantAndId(patient.id, specimen.id, specimen.identifier, reporter.id, authoriser.id)];
  }

  const serviceRequest = serviceRequestAndId(form.sample, patient.id, plan.id, reporter.id, specimen.id);
  const report = reportAndId(
    form.result,
    patient.id,
    reporter.id,
    authoriser.id,
    org.id,
    specimen.id,
    variants.map((variant) => variant.id),
  );
  return {
    resourceType: "Bundle",
    type: "transaction",
    entry: [
      createEntry(patient.resource, form.patient.mrn),
      createEntry(org.resource, org.identifier),
      createEntry(specimen.resource, specimen.identifier),
      createEntry(authoriser.resource),
      createEntry(reporter.resource),
      variants.map((variant) => createEntry(variant.resource, variant.identifier)),
      createEntry(furtherTesting.resource),
      createEntry(plan.resource),
      createEntry(serviceRequest.resource),
      createEntry(report.resource),
    ],
  };
};

/**
 * Create individual entry for a bundle.
 *
 * If identifier is given then the method will be update or create, otherwise only create.
 * @param resource resource to send
 * @param identifier identifier used to query on (update if exists or create if not)
 */
const createEntry = (resource: Resource, identifier?: string) => {
  let requestInfo = { method: "POST", url: resource.resourceType };
  if (identifier !== undefined) {
    requestInfo = { method: "PUT", url: `${resource.resourceType}?identifier=${identifier}` };
  }

  return {
    resource: resource,
    resourceType: resource.resourceType,
    request: requestInfo,
  };
};
