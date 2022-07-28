import { Patient } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/patient";
import { FormValues } from "./ReportForm";

export const initialValues: FormValues = {
  address: {
    name: "London North Genomic Laboratory Hub",
    streetAddress: [
      "Great Ormond Street Hospital for Children NHS Foundation Trust",
      "Levels 4-6 Barclay House",
      "37 Queen Square",
    ],
    city: "London",
    country: "UK",
    postCode: "WC1N 3BH",
  },
  patient: {
    mrn: "969977",
    firstName: "Donald",
    lastName: "Duck",
    dateOfBirth: "2012-03-04",
    gender: Patient.GenderEnum.Male,
    familyNumber: "Z409929",
  },
  sample: {
    specimenCode: "19RG-183G0127",
    // will need codes here too - but probably best to load all possible codes and then query
    specimenType: "Venus blood specimen",
    collectionDateTime: "04/06/2019 12:00",
    receivedDateTime: "04/06/2019 15:00",
    reasonForTestCode: "230387008",
    reasonForTestText:
      "Sequence variant screening in Donald Duck because of epilepsy and atypical absences. " +
      "An SLC2A1 variant is suspected.",
  },
  variant: [
    {
      gene: "GNAO1",
      geneInformation:
        "NAO1: Heterozygous pathogenic variants cause EIEE17 (MIM 615473) " +
        "or neurodevelopmental disorder with involuntary movements without epilepsy (MIM 617493). " +
        "Clinical features range from severe motor and cognitive impairment with marked choreoathetosis, " +
        "self-injurious behaviour and epileptic encephalopathy, to a milder course with moderate developmental delay, " +
        "complex stereotypies (facial dyskinesia) and mild epilepsy.",
      genomicHGVS: "c.119G>T",
      inheritanceMethod: "Autosomal dominant",
      // will also need a code
      classification: "Likely Pathogenic",
      proteinHGVS: "p.(Gly40Val)",
      transcript: "NM_006516.2",
      zygosity: "hetezygote",
      classificationEvidence:
        "absent from the gnomAD population database (PM2_Moderate).affects a gene with a low tolerance for missense variation (PP2_Supporting). predicted to be deleterious by in silico prediction tools (PP3_Supporting). similar variants affecting the same amino acid c.118G>A p.(Gly40Arg), c.118G>C p.(Gly40Arg), c.118G>T p.(Gly40Trp) & c.119G>A p.(Gly40Glu) have been previously reported in the literature (1-2) (PM5_Moderate) reported on ClinVar as likely pathogenic.",
      confirmedVariant: false,
      comment: "This variant occurs in a recessive gene that has been 100% sequenced and no second variant identified.",
    },
  ],
  result: {
    resultSummary:
      "Next generation sequence analysis indicates that Duck Donald is heterozygous for the GNAO1 " +
      "c.119G>T p.(Gly40Val) likely pathogenic variant that has been confirmed by Sanger sequence analysis " +
      "(see technical information below).",
    citation: "(1) Neul et al Am J Med Genet B Neuropsychiatr Genet. 2019 Jan;180(1):55-67",
    authorisingDate: "2021-04-25",
    authorisingScientist: "Lucy Jones",
    authorisingScientistTitle: "Consultant Clinical Scientist",
    furtherTesting:
      "Testing of Donald Duck's parents is recommended to determine whether the GNAO1 " +
      "c.119G>T p.(Gly40Val) likely pathogenic variant has arisen de novo and to assess the recurrence risk. " +
      "Please include clinical information for the parents. " +
      "A referral to their local clinical genetics service may be appropriate for this family.",
    reportingDate: "2021-04-25",
    reportingScientist: "Ana Pietra",
    reportingScientistTitle: "Clinical Scientist",
    testMethodology:
      "Screening of 82 genes associated with severe delay and seizures " +
      "... Variants are classified using the ACMG/AMP guidelines (Richards et al 2015 Genet Med) " +
      "/ACGS Best Practice guidelines (2019).",
    clinicalConclusion: "Confirms the diagnosis of Childhood-nset epileptic encephalopathy (EEOC).",
  },
};

export const initialWithNoVariant = {
  ...initialValues,
  variant: [],
};

export const noValues: FormValues = {
  address: {
    name: "",
    streetAddress: [],
    city: "",
    country: "",
    postCode: "",
  },
  patient: {
    mrn: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: undefined,
    familyNumber: "",
  },
  sample: {
    specimenCode: "",
    specimenType: "",
    collectionDateTime: "",
    receivedDateTime: "",
    reasonForTestCode: "",
    reasonForTestText: "",
  },
  variant: [],
  result: {
    resultSummary: "",
    clinicalConclusion: "",
    citation: "",
    furtherTesting: "",
    testMethodology: "",
    authorisingDate: "",
    authorisingScientist: "",
    authorisingScientistTitle: "",
    reportingDate: "",
    reportingScientist: "",
    reportingScientistTitle: "",
  },
};
