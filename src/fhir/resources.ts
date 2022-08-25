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
import { parseDateTime } from "../utils/dateTime";
import { codedValue, loincSelect } from "../code_systems/loincCodes";
import { diseases, sampleTypes } from "../code_systems/snomedCodes";
import { RequiredCoding } from "../code_systems/types";

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
  patient.birthDate = form.dateOfBirth;
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
        // custom code
        {
          system: "http://term.hl7.org/CodeSystem/org-id-types",
          code: "gosh-org",
          display: "NHS UK Healthcare Provider",
        },
      ],
      text: "NHS UK Healthcare Provider",
    },
  ];
  org.name = form.name;
  org.address = [
    {
      line: form["streetAddress"].split(","), // split the string to maintain Array type and conform with FHIR schema
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
    authoriser: practitionerAndId(result.authorisingScientist, result.authorisingScientistTitle, "auth"),
    reporter: practitionerAndId(result.reportingScientist, result.reportingScientistTitle, "report"),
  };
};

type ScientistRole = "auth" | "report";

/**
 * Create a practitioner from limited data.
 *
 * If the same scientist reports and authorises reports, then each role will create a separate practitioner.
 * @param fullName the first word will be the firstName, remaining words will be lastName
 * @param title job title within the laboratory
 * @param role role in the reporting process
 */
const practitionerAndId = (fullName: string, title: string, role: ScientistRole): ResourceAndIds => {
  const nameSplit = fullName.split(/\s/g);
  const firstName = nameSplit[0];
  const lastName = nameSplit.slice(1).join(" ");
  const practitioner = new Practitioner();

  let roleText = "Reported By";
  if (role === "auth") {
    roleText = "Authorized By";
  }

  practitioner.id = uuidv4();
  practitioner.resourceType = "Practitioner";
  practitioner.active = true;
  const identifier = fullName.toLowerCase().replaceAll(/\s/g, "");
  practitioner.identifier = [{ value: identifier }];
  practitioner.name = [{ given: [firstName], family: lastName, use: HumanName.UseEnum.Official, text: roleText }];
  practitioner.qualification = [{ code: { text: title } }];

  return { identifier: `${fullName}_${role}`, id: practitioner.id, resource: practitioner };
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
  specimen.receivedTime = parseDateTime(sample.receivedDateTime).toJSDate();
  if (sample.collectionDateTime !== undefined) {
    specimen.collection = { collectedDateTime: parseDateTime(sample.collectionDateTime).toISO() };
  }
  specimen.identifier = [{ value: sample.specimenCode, id: "specimen id" }];
  specimen.type = {
    coding: [codedValue(sampleTypes, sample.specimenType)],
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
  obs.category = [
    {
      coding: [
        {
          system: "http://terminology.hl7.org/obs-category",
          code: "laboratory",
          display: "Laboratory",
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
  reportedGenes: RequiredCoding[],
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
  const geneComponent = codedValue(reportedGenes, variant.gene);
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
      codedValue(loincSelect.zygosity, variant.zygosity),
    ),
    observationComponent(
      {
        system: "http://loinc.org",
        code: "53037-8",
        display: "Genetic disease sequence variation interpretation",
      },
      codedValue(loincSelect.classification, variant.classification),
    ),
    observationComponent(
      {
        system: "http://loinc.org",
        code: "79742-3",
        display: "Inheritance pattern based on family history",
      },
      codedValue(loincSelect.inheritance, variant.inheritanceMethod),
    ),
    observationComponent(
      {
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
    // matching GOSH structure for gene to use text as the value
    observationComponent(
      {
        system: geneComponent.system,
        code: geneComponent.code,
      },
      geneComponent.display as string,
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
  ];
  if (variant.geneInformation !== undefined) {
    obs.note.push({
      authorString: "gene information",
      text: variant.geneInformation,
    });
  }

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
  if (sample.reasonForTestText !== undefined) {
    plan.description = sample.reasonForTestText;
  }
  plan.action = [
    {
      prefix: "1",
      description: report.testMethodology,
      title: "Test Method",
    },
  ];

  if (report.citation !== undefined) {
    plan.relatedArtifact = [
      {
        type: RelatedArtifact.TypeEnum.Citation,
        citation: report.citation,
      },
    ];
  }
  plan.subjectReference = reference("Patient", patientId);

  return { id: plan.id, resource: plan };
};

export const furtherTestingAndId = (report: ReportDetailSchema, patientId: string): ResourceAndId => {
  const task = new Task();
  task.id = uuidv4();
  task.resourceType = "Task";
  task.status = Task.StatusEnum.Requested;
  task.intent = Task.IntentEnum.Plan;
  if (report.followUp) {
    task.code = {
      coding: [codedValue(loincSelect.followUp, report.followUp)],
    };
  }
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
      coding: [codedValue(diseases, sample.reasonForTest)],
      text: sample.reasonForTestText,
    },
  ];

  request.specimen = [reference("Specimen", specimenId)];

  return { id: request.id, resource: request };
};

export const reportAndId = (
  result: ReportDetailSchema,
  sample: SampleSchema,
  patientId: string,
  reporterId: string,
  authoriserId: string,
  organisationId: string,
  specimenId: string,
  resultIds: string[],
): ResourceAndId => {
  const report = new DiagnosticReport();
  report.id = uuidv4();
  report.issued = result.reportingDate;
  report.effectiveDateTime = result.authorisingDate;
  report.resourceType = "DiagnosticReport";
  report.status = DiagnosticReport.StatusEnum.Final;
  report.subject = reference("Patient", patientId);
  report.specimen = [reference("Specimen", specimenId)];
  report.performer = [reference("Organization", organisationId)];
  report.result = resultIds.map((resultId) => reference("Observation", resultId));
  report.resultsInterpreter = [reference("Practitioner", reporterId), reference("Practitioner", authoriserId)];
  report.code = {
    coding: [codedValue(diseases, sample.reasonForTest)],
  };
  report.conclusion = result.clinicalConclusion;

  return { id: report.id, resource: report };
};
