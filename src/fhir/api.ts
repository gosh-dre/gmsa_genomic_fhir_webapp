import { Resource } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";
import { FormValues } from "../components/reports/ReportForm";
import {
  createNullVariantAndQuery,
  furtherTestingAndId,
  interpretationAndQuery,
  organisationAndQuery,
  patientAndQuery,
  planDefinitionAndId,
  practitionersAndQueries,
  reportAndId,
  ResourceAndQuery,
  serviceRequestAndId,
  specimenAndQuery,
  variantAndQuery,
} from "./resources";
import { VariantSchema } from "../components/reports/formDataValidation";
import { loincResources } from "../code_systems/loincCodes";
import { RequiredCoding } from "../code_systems/types";
import { v4 as uuidv4 } from "uuid";

/**
 * Create a report bundle
 * @param form values from the front end form
 * @param reportedGenes genes used in the report
 */
export const bundleRequest = (form: FormValues, reportedGenes: RequiredCoding[]) => {
  return {
    url: "/",
    method: "POST",
    headers: { "Content-Type": "application/fhir+json;charset=UTF-8" },
    body: JSON.stringify(createBundle(form, reportedGenes)),
  };
};

export const createBundle = (form: FormValues, reportedGenes: RequiredCoding[]) => {
  const org = organisationAndQuery(form.address);
  const patient = patientAndQuery(form.patient, org.query);
  const specimen = specimenAndQuery(form.sample, patient.query);
  const furtherTesting = furtherTestingAndId(form.result, patient.query);
  const plan = planDefinitionAndId(form.sample, form.result, patient.query);
  const { authoriser, reporter } = practitionersAndQueries(form.result);
  let variants: ResourceAndQuery[];
  if (form.variant.length) {
    variants = form.variant.map((variant: VariantSchema) =>
      variantAndQuery(
        variant,
        reportedGenes,
        patient.query,
        specimen.query,
        specimen.query,
        reporter.query,
        authoriser.query,
      ),
    );
  } else {
    variants = [
      createNullVariantAndQuery(patient.query, specimen.query, specimen.query, reporter.query, authoriser.query),
    ];
  }

  const overallInterpretation = interpretationAndQuery(
    form.result,
    patient.query,
    specimen.query,
    specimen.query,
    reporter.query,
    authoriser.query,
  );
  const serviceRequest = serviceRequestAndId(form.sample, patient.query, plan.id, reporter.query, specimen.query);
  const report = reportAndId(
    form.result,
    form.sample,
    patient.query,
    reporter.query,
    authoriser.query,
    org.query,
    specimen.query,
    variants.map((variant) => variant.query),
  );
  return {
    id: uuidv4(),
    resourceType: "Bundle",
    type: "batch",
    entry: [
      createEntry(patient.resource, patient.query),
      createEntry(org.resource, org.query),
      createEntry(specimen.resource, specimen.query),
      createEntry(authoriser.resource),
      createEntry(reporter.resource),
      createEntry(overallInterpretation.resource, overallInterpretation.query),
      ...variants.map((variant) => createEntry(variant.resource, variant.query)),
      createEntry(furtherTesting.resource),
      createEntry(plan.resource),
      createEntry(serviceRequest.resource),
      createEntry(report.resource),
      // add value sets to bundle for API validation
      ...loincResources.map((vs) => createEntry(vs.resource, vs.identifier)),
    ],
  };
};

/**
 * Create individual entry for a bundle.
 *
 * If identifier is given then the method will update or create, otherwise only create.
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
    request: requestInfo,
  };
};
