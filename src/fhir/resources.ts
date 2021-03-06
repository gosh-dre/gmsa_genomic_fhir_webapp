import {
  AddressSchema,
  PatientSchema,
  ReportDetailSchema,
  SampleSchema,
  VariantSchema,
} from "../components/reports/formDataValidation";
import { v4 as uuidv4 } from "uuid";
import {
  DiagnosticReport,
  HumanName,
  Organization,
  Patient,
  PlanDefinition,
  Practitioner,
  RelatedArtifact,
  Resource,
  ServiceRequest,
  Specimen,
  Task,
} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";
import {
  createPatientObservation,
  generatedNarrative,
  makeGoshAssigner,
  observationComponent,
  reference,
} from "./resource_helpers";

export const GOSH_GENETICS_IDENTIFIER = "gosh-genomics-fbf63df8-947b-4040-82bb-41fcacbe8bad";

/**
 * Resource and reference ID for referring to the resource within a bundle.
 */
type ResourceAndId = {
  resource: Resource;
  id: string;
};

export type ResourceAndIds = ResourceAndId & {
  identifier: string;
};

/**
 * Create a FHIR patient object from form data
 * @param form patient data
 * @param organisationId uuid for the organisation
 */
export const patientAndId = (form: PatientSchema, organisationId: string): ResourceAndIds => {
  const patient = new Patient();
  patient.id = uuidv4();
  patient.active = true;
  patient.gender = form.gender;
  patient.name = [{ family: form.lastName, given: [form.firstName] }];
  patient.identifier = [
    { value: form.mrn, ...makeGoshAssigner("MRN") },
    // implementing GOSH's structure, they chose this to represent a family as it doesn't exist in the specification
    {
      extension: [
        {
          url: "https://fhir.nhs.uk/R4/StructureDefinition/Extension-UKCore-NHSNumberVerificationStatus",
          valueCodeableConcept: {
            coding: [
              {
                system: "https://fhir.nhs.uk/R4/CodeSystem/UKCore-NHSNumberVerificationStatus",
                code: form.familyNumber,
                display: "Family Number",
              },
            ],
          },
        },
      ],
    },
  ];
  patient.birthDate = form.dateOfBirth.toString();
  patient.text = generatedNarrative(form.firstName, form.lastName);
  patient.resourceType = "Patient";
  patient.managingOrganization = reference("Organization", organisationId);
  return { identifier: form.mrn, id: patient.id, resource: patient };
};

export const organisationAndId = (form: AddressSchema): ResourceAndIds => {
  const org = new Organization();
  org.id = uuidv4();
  org.identifier = [{ value: GOSH_GENETICS_IDENTIFIER }];
  org.resourceType = "Organization";
  org.active = true;
  org.type = [
    {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/organization-type",
          code: "prov",
          display: "Healthcare Provider",
        },
      ],
      text: "Healthcare Provider",
    },
  ];
  org.name = form.name;
  org.address = [
    {
      line: form.streetAddress,
      city: form.city,
      postalCode: form.postCode,
      country: form.country,
    },
  ];
  org.text = generatedNarrative(form.name);

  return { identifier: GOSH_GENETICS_IDENTIFIER, id: org.id, resource: org };
};

export const practitionersAndIds = (result: ReportDetailSchema) => {
  return {
    authoriser: practitionerAndId(result.authorisingScientist, result.authorisingScientistTitle),
    reporter: practitionerAndId(result.reportingScientist, result.reportingScientistTitle),
  };
};

/**
 * Create a practitioner from limited data.
 * @param fullName the first word will be the firstName, remaining words will be lastName
 * @param title role or job title within the laboratory
 */
const practitionerAndId = (fullName: string, title: string): ResourceAndIds => {
  const nameSplit = fullName.split(/\s/g);
  const firstName = nameSplit[0];
  const lastName = nameSplit.slice(1).join(" ");
  const practitioner = new Practitioner();

  practitioner.id = uuidv4();
  practitioner.resourceType = "Practitioner";
  practitioner.active = true;
  const identifier = fullName.toLowerCase().replaceAll(/\s/g, "");
  practitioner.identifier = [{ value: identifier }];
  practitioner.name = [{ given: [firstName], family: lastName, use: HumanName.UseEnum.Official }];
  // suggested shorter form for role
  practitioner.qualification = [{ code: { text: title } }];

  return { identifier: `${fullName} ${title}`, id: practitioner.id, resource: practitioner };
};

/**
 * Create specimen resource from form data and link it to the patient.
 * @param sample form data
 * @param patientId to link the specimen with
 */
export const specimenAndId = (sample: SampleSchema, patientId: string): ResourceAndIds => {
  const specimen = new Specimen();
  specimen.id = uuidv4();
  specimen.resourceType = "Specimen";
  specimen.receivedTime = sample.receivedDateTime;
  specimen.collection = { collectedDateTime: sample.collectionDateTime.toString() };
  specimen.identifier = [{ value: sample.specimenCode, id: "specimenId" }];
  specimen.type = {
    coding: [
      {
        system: "http://snomed.info/sct",
        code: "122555007",
        display: "Venus blood specimen",
      },
    ],
  };
  specimen.subject = reference("Patient", patientId);

  return { identifier: sample.specimenCode, id: specimen.id, resource: specimen };
};

export const createNullVariantAndId = (
  patientId: string,
  specimenId: string,
  specimenBarcode: string,
  reporterId: string,
  authoriserId: string,
): ResourceAndIds => {
  const obsId = uuidv4();
  const obs = createPatientObservation(
    obsId,
    patientId,
    specimenId,
    reporterId,
    authoriserId,
    "69548-6",
    "Genetic variant assessment",
  );
  obs.meta = { profile: ["http://hl7.org/fhir/uv/genomics-reporting/StructureDefinition/Variant"] };
  obs.note = [
    {
      text: "No variants reported",
    },
  ];
  const identifier = `${specimenBarcode}$null:null`;
  obs.identifier = [{ value: identifier, id: "specimenBarcode$transcript:genomicHGVS" }];

  return { identifier: identifier, id: obsId, resource: obs };
};

export const interpretationAndId = (
  result: ReportDetailSchema,
  patientId: string,
  specimenId: string,
  specimenBarcode: string,
  reporterId: string,
  authoriserId: string,
): ResourceAndIds => {
  const obsId = uuidv4();
  const obs = createPatientObservation(
    obsId,
    patientId,
    specimenId,
    reporterId,
    authoriserId,
    "51968-6",
    "Genetic disease analysis overall interpretation",
  );

  obs.meta = { profile: ["http://hl7.org/fhir/uv/genomics-reporting/StructureDefinition/overall-interpretation"] };
  obs.interpretation = [
    {
      coding: [
        {
          system: "http://loinc.org",
          code: "LA6576-8",
          display: result.clinicalConclusion,
        },
      ],
    },
  ];
  obs.valueString = result.resultSummary;
  const identifier = `${specimenBarcode}$overall-interpretation`;
  obs.identifier = [{ value: identifier, id: "{specimenBarcode}$overall-interpretation" }];

  return { identifier: identifier, id: obsId, resource: obs };
};

export const variantAndId = (
  variant: VariantSchema,
  patientId: string,
  specimenId: string,
  specimenBarcode: string,
  reporterId: string,
  authoriserId: string,
): ResourceAndIds => {
  const obsId = uuidv4();
  const obs = createPatientObservation(
    obsId,
    patientId,
    specimenId,
    reporterId,
    authoriserId,
    "69548-6",
    "Genetic variant assessment",
  );
  obs.meta = { profile: ["http://hl7.org/fhir/uv/genomics-reporting/StructureDefinition/variant"] };
  obs.component = [
    observationComponent(
      {
        system: "http://loinc.org",
        code: "51958-7",
        display: "Transcript reference sequence identifier",
      },
      {
        system: "http://www.ncbi.nlm.nih.gov/refseq",
        code: variant.transcript,
      },
    ),
    observationComponent(
      {
        system: "http://loinc.org",
        code: "53034-5",
        display: "Allelic state",
      },
      {
        system: "http://loinc.org",
        // code hard-coded for now but this will be addressed when linking in with clinical coding
        code: "LA6705-3",
        display: variant.zygosity,
      },
    ),
    observationComponent(
      {
        // code hard-coded for now but this will be addressed when linking in with clinical coding
        system: "http://loinc.org",
        code: "53037-8",
        display: "Genetic disease sequence variation interpretation",
      },
      {
        system: "http://loinc.org",
        code: "LA26332-9",
        display: variant.classification,
      },
    ),
    observationComponent(
      {
        // code hard-coded for now but this will be addressed when linking in with clinical coding
        system: "http://loinc.org",
        code: "79742-3",
        display: "Inheritance pattern based on family history",
      },
      {
        system: "http://loinc.org",
        code: "LA24640-7",
        display: variant.inheritanceMethod,
      },
    ),
    observationComponent(
      {
        // code hard-coded for now but this will be addressed when linking in with clinical coding
        system: "http://loinc.org",
        code: "48005-3",
        display: "Amino acid change (pHGVS)",
      },
      {
        system: "http://varnomen.hgvs.org/",
        code: variant.proteinHGVS,
      },
    ),
    observationComponent(
      {
        // code hard-coded for now but this will be addressed when linking in with clinical coding
        system: "http://loinc.org",
        code: "48004-6",
        display: "DNA change (c.HGVS)",
      },
      {
        system: "http://varnomen.hgvs.org/",
        display: variant.genomicHGVS,
      },
    ),
    observationComponent(
      {
        // custom code
        system: "http://hl7.org/evidence",
        code: "evidence",
        display: "Evidence for classification of variant",
      },
      variant.classificationEvidence,
    ),
    observationComponent(
      {
        // code hard-coded for now but this will be addressed when linking in with clinical coding
        system: "http://www.genenames.org/geneId",
        code: "HGNC:4389",
      },
      variant.gene,
    ),
    observationComponent(
      {
        // custom code
        system: "http://hl7.org/variant",
        code: "confirmed-variant",
      },
      variant.confirmedVariant,
    ),
  ];
  obs.note = [
    {
      authorString: "comments",
      text: variant.comment,
    },
  ];
  obs.note = [
    {
      authorString: "comments",
      text: variant.comment,
    },
    {
      authorString: "gene information",
      text: variant.geneInformation,
    },
  ];
  const identifier = `${specimenBarcode}$${variant.transcript}:${variant.genomicHGVS}`;
  obs.identifier = [{ value: identifier, id: "{specimenBarcode}${transcript}:{genomicHGVS}" }];

  return { identifier: identifier, id: obsId, resource: obs };
};

export const planDefinitionAndId = (
  sample: SampleSchema,
  report: ReportDetailSchema,
  patientId: string,
): ResourceAndId => {
  const plan = new PlanDefinition();
  plan.id = uuidv4();
  plan.resourceType = "PlanDefinition";
  plan.status = PlanDefinition.StatusEnum.Active;
  plan.type = {
    coding: [
      {
        system: "http://terminology.hl7.org/CodeSystem/plan-definition-type",
        code: "protocol",
        display: "Protocol",
      },
    ],
  };
  plan.description = sample.reasonForTestText;
  plan.action = [
    {
      prefix: "1",
      description: report.testMethodology,
      title: "Test Method",
    },
  ];
  plan.relatedArtifact = [
    {
      type: RelatedArtifact.TypeEnum.Citation,
      citation: report.citation,
    },
  ];
  plan.subjectReference = reference("Patient", patientId);

  return { id: plan.id, resource: plan };
};

export const furtherTestingAndId = (report: ReportDetailSchema, patientId: string): ResourceAndId => {
  const task = new Task();
  task.id = uuidv4();
  task.resourceType = "Task";
  task.status = Task.StatusEnum.Requested;
  task.intent = Task.IntentEnum.Plan;
  task.code = {
    // harcoded for now but should be set from form, allowing multiple selections from the coding system
    // coding system: LL1037-2
    coding: [
      {
        system: "http://loinc.org",
        code: "LA14020-4",
        display: "Genetic counseling recommended",
      },
    ],
  };
  task.description = report.furtherTesting;
  task.for = reference("Patient", patientId);
  return { id: task.id, resource: task };
};

/**
 * Create a service request resource from form data and dependent references.
 * @param sample form data for sample
 * @param patientId id for Patient
 * @param planId id for PlanDefinition
 * @param practitionerId Practitioner Id for the reporting scientist
 * @param specimenId
 */
export const serviceRequestAndId = (
  sample: SampleSchema,
  patientId: string,
  planId: string,
  practitionerId: string,
  specimenId: string,
): ResourceAndId => {
  const request = new ServiceRequest();
  request.resourceType = "ServiceRequest";
  request.id = uuidv4();
  request.meta = { profile: ["http://hl7.org/fhir/StructureDefinition/servicerequest"] };
  request.text = generatedNarrative("Lab Procedure");
  request.instantiatesCanonical = [`PlanDefinition/${planId}`];
  request.status = "active";
  request.intent = "order";
  request.category = [
    {
      coding: [
        {
          system: "http://snomed.info/sct",
          code: "108252007",
          display: "Laboratory procedure",
        },
      ],
    },
  ];
  request.subject = reference("Patient", patientId);
  request.performerType = {
    coding: [
      {
        system: "http://snomed.info/sct",
        code: "310049001",
        display: "Clinical genetics service",
      },
    ],
  };
  request.performer = [reference("Practitioner", practitionerId)];
  request.reasonCode = [
    {
      coding: [
        {
          // hardcoded for now, but have issue to pull this through from clinical APIs
          system: "http://snomed.info/sct",
          code: sample.reasonForTestCode,
          display: "Reason for recommending early-onset benign childhood occipita epilepsy",
        },
      ],
      text: sample.reasonForTestText,
    },
  ];
  request.reasonCode = [
    {
      coding: [
        {
          // hardcoded for now, but have issue to pull this through from clinical APIs
          system: "http://snomed.info/sct",
          code: sample.reasonForTestCode,
          display: "Reason for recommending early-onset benign childhood occipita epilepsy",
        },
      ],
      text: sample.reasonForTestText,
    },
  ];
  request.specimen = [reference("Specimen", specimenId)];

  return { id: request.id, resource: request };
};

export const reportAndId = (
  result: ReportDetailSchema,
  patientId: string,
  reporterId: string,
  authoriserId: string,
  organisationId: string,
  specimenId: string,
  resultIds: string[],
): ResourceAndId => {
  const report = new DiagnosticReport();
  report.id = uuidv4();
  report.effectiveDateTime = result.authorisingDate.toString();
  report.issued = result.reportingDate.toString();
  report.resourceType = "DiagnosticReport";
  report.status = DiagnosticReport.StatusEnum.Final;
  report.subject = reference("Patient", patientId);
  report.specimen = [reference("Specimen", specimenId)];
  report.performer = [reference("Organization", organisationId)];
  report.result = resultIds.map((resultId) => reference("Observation", resultId));
  report.resultsInterpreter = [reference("Practitioner", reporterId), reference("Practitioner", authoriserId)];
  // waiting for confirmation of change of coding system to snomed-ct
  report.code = {
    coding: [
      {
        // harcoded for now, but will pull this through
        system: "http://loinc.org",
        code: "81247-9",
        display: "Early onset or syndromic epilepsy",
      },
    ],
  };
  report.conclusion = result.clinicalConclusion;

  return { id: report.id, resource: report };
};
