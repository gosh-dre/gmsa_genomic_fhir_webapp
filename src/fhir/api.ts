import { Bundle, Resource } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";
import { FormValues } from "../components/reports/ReportForm";
import {
  createNullVariantAndIdentifier,
  furtherTestingAndId,
  interpretationAndIdentifier,
  organisationAndIdentifier,
  patientAndIdentifier,
  planDefinitionAndId,
  practitionersAndQueries,
  reportAndId,
  ResourceAndIdentifier,
  serviceRequestAndId,
  specimenAndIdentifier,
  variantAndIdentifier,
} from "./resources";
import { VariantSchema } from "../components/reports/formDataValidation";
import { loincResources } from "../code_systems/loincCodes";
import { BundleResponse, RequiredCoding } from "../code_systems/types";

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

export const createBundle = (form: FormValues, reportedGenes: RequiredCoding[]): Bundle => {
  const org = organisationAndIdentifier(form.address);
  const patient = patientAndIdentifier(form.patient, org.identifier);
  const specimen = specimenAndIdentifier(form.sample, patient.identifier);
  const furtherTesting = furtherTestingAndId(form.result, patient.identifier);
  const plan = planDefinitionAndId(form.sample, form.result, patient.identifier);
  const { authoriser, reporter } = practitionersAndQueries(form.result);
  let variants: ResourceAndIdentifier[];
  if (form.variant.length) {
    variants = form.variant.map((variant: VariantSchema) =>
      variantAndIdentifier(
        variant,
        reportedGenes,
        patient.identifier,
        specimen.identifier,
        specimen.identifier,
        reporter.identifier,
        authoriser.identifier,
      ),
    );
  } else {
    variants = [
      createNullVariantAndIdentifier(
        patient.identifier,
        specimen.identifier,
        specimen.identifier,
        reporter.identifier,
        authoriser.identifier,
      ),
    ];
  }

  const overallInterpretation = interpretationAndIdentifier(
    form.result,
    patient.identifier,
    specimen.identifier,
    specimen.identifier,
    reporter.identifier,
    authoriser.identifier,
  );
  const serviceRequest = serviceRequestAndId(
    form.sample,
    patient.identifier,
    plan.identifier,
    reporter.identifier,
    specimen.identifier,
  );
  const report = reportAndId(
    form.result,
    form.sample,
    patient.identifier,
    reporter.identifier,
    authoriser.identifier,
    org.identifier,
    specimen.identifier,
    variants.map((variant) => variant.identifier),
  );
  return {
    resourceType: "Bundle",
    type: Bundle.TypeEnum.Batch,
    entry: [
      createEntry(org.resource, org.identifier),
      createEntry(patient.resource, patient.identifier),
      createEntry(specimen.resource, specimen.identifier),
      createEntry(authoriser.resource, authoriser.identifier),
      createEntry(reporter.resource, reporter.identifier),
      createEntry(overallInterpretation.resource, overallInterpretation.identifier),
      ...variants.map((variant) => createEntry(variant.resource, variant.identifier)),
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
 * @param identifier identifier used to identifier on (update if exists or create if not)
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

export const checkResponseOK = async (response: Response) => {
  const r = await response.json();

  if (!response.ok) {
    console.error(r.body);
    throw new Error(response.statusText);
  }
  if (!(r.type === "bundle-response")) {
    return r;
  }

  const errors = (r as BundleResponse).entry
    .filter((entry) => entry.response.status.toString().startsWith("4"))
    .map((entry) => entry.response.outcome.issue);

  if (errors.length > 1) {
    errors.forEach((issue) => {
      let message = "unknown error in bundle";
      if (issue && issue.length > 0) {
        message = issue[0].diagnostics;
      }
      throw new Error(message);
    });
  }

  if (r.type === "batch-response") {
    const errorsForModal = [];
    const responseStatus = (r as BundleResponse).entry.map((entry) => entry.response.status);
    if (!responseStatus.toString().startsWith("2")) {
      const responseIssue = (r as BundleResponse).entry.map((entry) => entry.response.outcome.issue);
      const issueDiagnostics = responseIssue?.map((issue) => issue?.[0].diagnostics);

      errorsForModal.push([r.resourceType, responseStatus, issueDiagnostics]); // need to make these accessible
    }
    return errorsForModal;
  }

  console.debug(`check response: ${JSON.stringify(r, null, 2)}`);
  return r;
};
