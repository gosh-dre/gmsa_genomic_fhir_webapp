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
  createIdentifier,
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
 * Resource and reference identifier to the resource.
 */
export type ResourceAndIdentifier = {
  resource: Resource;
  identifier: string;
};

type ResourceAndId = {
  resource: Resource;
  id: string;
};

/**
 * Create a FHIR patient object from form data
 * @param form patient data
 * @param organisationIdentifier used to link resource
 */
export const patientAndIdentifier = (form: PatientSchema, organisationIdentifier: string): ResourceAndIdentifier => {
  const patient = new Patient();
  patient.active = true;
  patient.gender = form.gender;
  patient.name = [{ family: form.lastName, given: [form.firstName] }];
  const identifier = createIdentifier(form.mrn, makeGoshAssigner("MRN"));

  patient.identifier = [
    identifier,
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
  patient.managingOrganization = reference("Organization", organisationIdentifier);
  return { identifier: identifier.value, resource: patient };
};

export const organisationAndIdentifier = (form: AddressSchema): ResourceAndIdentifier => {
  const org = new Organization();
  const identifier = createIdentifier(GOSH_GENETICS_IDENTIFIER);
  org.identifier = [identifier];
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

  return { identifier: identifier.value, resource: org };
};

export const practitionersAndQueries = (result: ReportDetailSchema) => {
  return {
    authoriser: practitionerAndIdentifier(result.authorisingScientist, result.authorisingScientistTitle, "auth"),
    reporter: practitionerAndIdentifier(result.reportingScientist, result.reportingScientistTitle, "report"),
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
const practitionerAndIdentifier = (fullName: string, title: string, role: ScientistRole): ResourceAndIdentifier => {
  const nameSplit = fullName.split(/\s/g);
  const firstName = nameSplit[0];
  const lastName = nameSplit.slice(1).join(" ");

  let roleText = "Reported By";
  if (role === "auth") {
    roleText = "Authorized By";
  }

  const practitioner = new Practitioner();
  practitioner.resourceType = "Practitioner";
  practitioner.active = true;
  const normalisedIdentifier = `${fullName}_${role}`.replaceAll(/\s/g, "").toLowerCase();
  const identifier = createIdentifier(normalisedIdentifier);
  practitioner.identifier = [identifier];
  practitioner.name = [{ given: [firstName], family: lastName, use: HumanName.UseEnum.Official, text: roleText }];
  practitioner.qualification = [{ code: { text: title } }];
  // TODO: add issuer
  return { identifier: identifier.value, resource: practitioner };
};

/**
 * Create specimen resource from form data and link it to the patient.
 * @param sample form data
 * @param patientIdentifier used to link resource
 */
export const specimenAndIdentifier = (sample: SampleSchema, patientIdentifier: string): ResourceAndIdentifier => {
  const specimen = new Specimen();
  specimen.resourceType = "Specimen";
  specimen.receivedTime = parseDateTime(sample.receivedDateTime).toJSDate();
  if (sample.collectionDateTime !== undefined) {
    specimen.collection = { collectedDateTime: parseDateTime(sample.collectionDateTime).toISO() };
  }
  if (sample.authorisedDateTime !== undefined) {
    specimen.processing = [{ timeDateTime: parseDateTime(sample.authorisedDateTime).toISO() }];
  }
  const identifier = createIdentifier(sample.specimenCode, { id: "specimen id" });
  specimen.identifier = [identifier];
  specimen.type = {
    coding: [codedValue(sampleTypes, sample.specimenType)],
  };
  specimen.subject = reference("Patient", patientIdentifier);

  return { identifier: identifier.value, resource: specimen };
};

export const createNullVariantAndIdentifier = (
  patientIdentifier: string,
  specimenIdentifier: string,
  specimenBarcode: string,
  reporterIdentifier: string,
  authoriserIdentifier: string,
): ResourceAndIdentifier => {
  const obs = createPatientObservation(
    patientIdentifier,
    specimenIdentifier,
    reporterIdentifier,
    authoriserIdentifier,
    "69548-6",
    "Genetic variant assessment",
  );
  obs.meta = { profile: ["http://hl7.org/fhir/uv/genomics-reporting/StructureDefinition/Variant"] };
  obs.note = [
    {
      text: "No variants reported",
    },
  ];
  const identifier = createIdentifier(`${specimenBarcode}$null:null`, { id: "specimenBarcode$transcript:genomicHGVS" });
  obs.identifier = [identifier];

  return { identifier: identifier.value, resource: obs };
};

export const interpretationAndIdentifier = (
  result: ReportDetailSchema,
  patientIdentifier: string,
  specimenIdentifier: string,
  specimenBarcode: string,
  reporterIdentifier: string,
  authoriserIdentifier: string,
): ResourceAndIdentifier => {
  const obs = createPatientObservation(
    patientIdentifier,
    specimenIdentifier,
    reporterIdentifier,
    authoriserIdentifier,
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
  obs.note = [{ authorString: "genomic interpretation", text: result.resultSummary }];
  obs.valueCodeableConcept = {
    coding: [codedValue(loincSelect.reportFinding, result.reportFinding)],
    text: "report finding",
  };
  const identifier = createIdentifier(`${specimenBarcode}$overall-interpretation`, {
    id: "{specimenBarcode}$overall-interpretation",
  });
  obs.identifier = [identifier];

  return { identifier: identifier.value, resource: obs };
};

export const variantAndIdentifier = (
  variant: VariantSchema,
  reportedGenes: RequiredCoding[],
  patientIdentifier: string,
  specimenIdentifier: string,
  specimenBarcode: string,
  reporterIdentifier: string,
  authoriserIdentifier: string,
): ResourceAndIdentifier => {
  const obs = createPatientObservation(
    patientIdentifier,
    specimenIdentifier,
    reporterIdentifier,
    authoriserIdentifier,
    "69548-6",
    "Genetic variant assessment",
  );
  obs.meta = { profile: ["http://hl7.org/fhir/uv/genomics-reporting/StructureDefinition/variant"] };
  const geneComponent = codedValue(reportedGenes, variant.gene);
  // ensure that cDNA representation follows ${transcript}:${cDNA change}
  let cDnaHgvs = variant.cDnaHgvs.trim();
  if (!cDnaHgvs.startsWith(variant.transcript)) {
    cDnaHgvs = `${variant.transcript}:${cDnaHgvs}`;
  }
  obs.component = [
    observationComponent(
      {
        system: "http://loinc.org",
        code: "48004-6",
        display: "DNA change (c.HGVS)",
      },
      {
        system: "http://varnomen.hgvs.org/",
        display: cDnaHgvs,
      },
    ),
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

  const identifier = createIdentifier(`${specimenBarcode}$${cDnaHgvs}`);
  obs.identifier = [identifier];

  return { identifier: identifier.value, resource: obs };
};

export const planDefinitionAndId = (
  sample: SampleSchema,
  report: ReportDetailSchema,
  patientIdentifier: string,
): ResourceAndIdentifier => {
  const plan = new PlanDefinition();
  plan.resourceType = "PlanDefinition";
  plan.status = PlanDefinition.StatusEnum.Active;
  if (sample.reasonForTestText !== undefined) {
    plan.description = sample.reasonForTestText;
  }
  plan.action = [
    {
      description: report.testMethodology,
      title: "Test Method",
    },
    {
      textEquivalent: report.genesTested,
      title: "gene list",
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
  plan.subjectReference = reference("Patient", patientIdentifier);
  const identifier = createIdentifier(`${patientIdentifier}`);
  plan.identifier = [identifier];

  return { identifier: identifier.value, resource: plan };
};

export const furtherTestingAndId = (report: ReportDetailSchema, patientIdentifier: string): ResourceAndId => {
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
  task.for = reference("Patient", patientIdentifier);
  return { id: task.id, resource: task };
};

/**
 * Create a service request resource from form data and dependent references.
 * @param sample form data for sample
 * @param patientIdentifier to link the resource
 * @param planIdentifier identifier search string for PlanDefinition
 * @param reporterIdentifier to link the resource for the reporting scientist
 * @param authoriserIdentifier to link the resource for the reporting scientist
 * @param specimenIdentifier to link the resource
 */
export const serviceRequestAndId = (
  sample: SampleSchema,
  patientIdentifier: string,
  planIdentifier: string,
  reporterIdentifier: string,
  authoriserIdentifier: string,
  specimenIdentifier: string,
): ResourceAndId => {
  const request = new ServiceRequest();
  request.resourceType = "ServiceRequest";
  request.id = uuidv4();
  request.meta = { profile: ["http://hl7.org/fhir/StructureDefinition/servicerequest"] };
  request.text = generatedNarrative("Lab Procedure");
  request.instantiatesCanonical = [reference("PlanDefinition", planIdentifier).reference];
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
  request.subject = reference("Patient", patientIdentifier);
  request.specimen = [reference("Specimen", specimenIdentifier)];
  request.performer = [reference("Practitioner", reporterIdentifier), reference("Practitioner", authoriserIdentifier)];
  request.performerType = {
    coding: [
      {
        system: "http://snomed.info/sct",
        code: "310049001",
        display: "Clinical genetics service",
      },
    ],
  };
  request.reasonCode = [
    {
      coding: [codedValue(diseases, sample.reasonForTest)],
      text: sample.reasonForTestText,
    },
  ];

  return { id: request.id, resource: request };
};

export const reportAndId = (
  result: ReportDetailSchema,
  sample: SampleSchema,
  patientIdentifier: string,
  reporterIdentifier: string,
  authoriserIdentifier: string,
  organisationIdentifier: string,
  specimenIdentifier: string,
  resultIds: string[],
): ResourceAndId => {
  const report = new DiagnosticReport();
  report.id = uuidv4();
  report.issued = result.reportingDate;
  report.effectiveDateTime = result.authorisingDate;
  report.resourceType = "DiagnosticReport";
  report.status = DiagnosticReport.StatusEnum.Final;
  report.subject = reference("Patient", patientIdentifier);
  report.specimen = [reference("Specimen", specimenIdentifier)];
  report.performer = [reference("Organization", organisationIdentifier)];
  report.result = resultIds.map((resultId) => reference("Observation", resultId));
  report.resultsInterpreter = [
    reference("Practitioner", reporterIdentifier),
    reference("Practitioner", authoriserIdentifier),
  ];
  report.code = {
    coding: [codedValue(diseases, sample.reasonForTest)],
  };
  report.conclusion = result.clinicalConclusion;

  return { id: report.id, resource: report };
};
