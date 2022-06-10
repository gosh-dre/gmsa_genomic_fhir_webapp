import {Patient} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/patient";
import {Fhir} from 'fhir/fhir';
import {FormValues} from "../components/reports/ReportForm";
import {createBundle} from "./api";

const fhir = new Fhir();

const testValues: FormValues = {
  address: {
    name: "London North Genomic Laboratory Hub",
    streetAddress: [
      "Great Ormond Street Hospital for Children NHS Foundation Trust",
      "Levels 4-6 Barclay House",
      "37 Queen Square"],
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
    collectionDate: "2019-06-04",
    reasonForTestCode: "230387008",
    reasonForTestText: "Sequence variant screening in Donald Duck because of epilepsy and atypical absences. " +
      "An SLC2A1 variant is suspected.",
  },
  variant: {
    gene: "GNAO1",
    genomicHGVS: "NM_020988.2:c.119G>T",
    inheritanceMethod: "AD",
    // will also need a code
    classification: "Likely Pathogenic",
    proteinHGVS: "p.(Gly40Val)",
    transcript: "NM_006516.2",
    zygosity: "hetezygote",
    classificationEvidence: "absent from the gnomAD population database (PM2_Moderate)." +
      "affects a gene with a low tolerance for missense variation (PP2_Supporting). " +
      "predicted to be deleterious by in silico prediction tools (PP3_Supporting). " +
      "similar variants affecting the same amino acid c.118G>A p.(Gly40Arg), " +
      "c.118G>C p.(Gly40Arg), c.118G>T p.(Gly40Trp) & c.119G>A p.(Gly40Glu) " +
      "have been previously reported in the literature (1-2) (PM5_Moderate) reported on ClinVar as likely pathogenic.",
    comment: "This variant occurs in a recessive gene that has been 100% sequenced and no second variant identified."
  },
  result: {
    resultSummary: "Next generation sequence analysis indicates that Duck Donald is heterozygous for the GNAO1 " +
      "c.119G>T p.(Gly40Val) likely pathogenic variant that has been confirmed by Sanger sequence analysis " +
      "(see technical information below).",
    geneInformation: "NAO1: Heterozygous pathogenic variants cause EIEE17 (MIM 615473) " +
      "or neurodevelopmental disorder with involuntary movements without epilepsy (MIM 617493). " +
      "Clinical features range from severe motor and cognitive impairment with marked choreoathetosis, " +
      "self-injurious behaviour and epileptic encephalopathy, to a milder course with moderate developmental delay, " +
      "complex stereotypies (facial dyskinesia) and mild epilepsy.",
    authorisingDate: "2021-04-25",
    authorisingScientist: "Lucy Jones",
    authorisingScientistTitle: "Consultant Clinical Scientist",
    furtherTesting: "Testing of Donald Duck's parents is recommended to determine whether the GNAO1 " +
      "c.119G>T p.(Gly40Val) likely pathogenic variant has arisen de novo and to assess the recurrence risk. " +
      "Please include clinical information for the parents. " +
      "A referral to their local clinical genetics service may be appropriate for this family.",
    reportingDate: "2021-04-25",
    reportingScientist: "Ana Pietra",
    reportingScientistTitle: "Clinical Scientist",
    testMethodology: "Screening of 82 genes associated with severe delay and seizures " +
      "... Variants are classified using the ACMG/AMP guidelines (Richards et al 2015 Genet Med) " +
      "/ACGS Best Practice guidelines (2019).",
    confirmedVariant: false,
    clinicalConclusion: "Confirms the diagnosis of Childhood-nset epileptic encephalopathy (EEOC).",
  }
};


describe("FHIR resources", () => {
  /**
   * Given that form data has been correctly populated
   * When a FHIR bundle is created
   * Then the fhir library should pass validation of the bundle
   */
  test('Bundle is valid', () => {

    const bundle = createBundle(testValues);

    const output = fhir.validate(bundle);
    console.info("Validation output");
    console.info(JSON.stringify(output.messages, null, 2));
    expect(output.valid).toBeTruthy();
  });
});
