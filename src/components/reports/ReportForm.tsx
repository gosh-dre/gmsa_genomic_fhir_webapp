import {useContext, useState} from "react";
import {Form, Formik, FormikHelpers} from 'formik';
import * as Yup from "yup"
import {FhirContext} from "../fhir/FhirContext";
import {Patient} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/patient";


import Card from "../UI/Card";
import classes from "./ReportForm.module.css";
import {addressSchema, patientSchema, reportDetailSchema, sampleSchema, variantSchema} from "./formDataValidation";
import FieldSet from "./FieldSet";
import {bundleRequest} from "../../fhir/api";

const FormValidation = Yup.object().shape({
  address: addressSchema,
  patient: patientSchema,
  sample: sampleSchema,
  variant: variantSchema,
  result: reportDetailSchema,
}).required();

type FormValues = Yup.InferType<typeof FormValidation>;

const initialValues: FormValues = {
  address: {
    streetAddress: [
      "London North Genomic Laboratory Hub",
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
    referenceNucleotide: "G",
    transcript: "NM_006516.2",
    variantNucleotide: "T",
    zygosity: "hetezygote",
    classificationEvidence: "absent from the gnomAD population database (PM2_Moderate)." +
      "affects a gene with a low tolerance for missense variation (PP2_Supporting). " +
      "predicted to be deleterious by in silico prediction tools (PP3_Supporting). " +
      "similar variants affecting the same amino acid c.118G>A p.(Gly40Arg), " +
      "c.118G>C p.(Gly40Arg), c.118G>T p.(Gly40Trp) & c.119G>A p.(Gly40Glu) " +
      "have been previously reported in the literature (1-2) (PM5_Moderate) reported on ClinVar as likely pathogenic.",
  },
  result: {
    resultSummary: "NAO1: Heterozygous pathogenic variants cause EIEE17 (MIM 615473) " +
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
  }
};

const ReportForm = () => {
  const [result, setResult] = useState('')
  const ctx = useContext(FhirContext);

  const onSuccessfulSubmitHandler = (values: FormValues, actions: FormikHelpers<FormValues>) => {
    const bundle = bundleRequest(values.patient);

    setResult(JSON.stringify(bundle, null, 2));

    ctx.client?.request(bundle)
      .then((response) => console.debug("Bundle submitted", bundle, response))
      .catch((error) => console.error(error));
    actions.setSubmitting(false);
  };

  return (
    <Card>
      <h1>Add a new report</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={FormValidation}
        onSubmit={onSuccessfulSubmitHandler}
      >
        <Form role="form" className={classes.form}>
          <h2>Reporting laboratory (later as a dropdown)</h2>

          <FieldSet as="textarea" name="address.streetAddress" label="Street Address"/>
          <FieldSet name="address.city" label="City"/>
          <FieldSet name="address.postCode" label="Post Code"/>
          <FieldSet name="address.country" label="Country"/>

          <h2>Patient information</h2>
          <FieldSet label="MRN" name="patient.mrn"/>
          <FieldSet label="First Name" name="patient.lastName"/>
          <FieldSet label="Last Name" name="patient.firstName"/>
          <FieldSet label="Date of Birth" name="patient.dateOfBirth" type="date"/>
          <FieldSet label="Gender" name="patient.gender"/>
          <FieldSet label="Family Number" name="patient.familyNumber"/>

          <h2>Sample</h2>

          <FieldSet name="sample.specimenCode" label="Barcode"/>
          <FieldSet name="sample.specimenType" label="Specimen Type"/>
          <FieldSet type="date" name="sample.collectionDate" label="Sample collection date"/>
          <FieldSet name="sample.reasonForTestText" label="Reason for test"/>
          <FieldSet name="sample.reasonForTestCode" label="Test reason code"/>

          <h2>Variant</h2>

          <FieldSet name="variant.gene" label="Gene Symbol"/>
          <FieldSet name="variant.transcript" label="Transcript"/>
          <FieldSet name="variant.referenceNucleotide" label="Reference Nucleotide"/>
          <FieldSet name="variant.variantNucleotide" label="Variant Nucleotide"/>
          <FieldSet name="variant.genomicHGVS" label="Genomic HGVS"/>
          <FieldSet name="variant.proteinHGVS" label="Protein HGVS"/>
          <FieldSet name="variant.zygosity" label="Zygosity"/>
          <FieldSet name="variant.inheritanceMethod" label="Inhertiance Method"/>
          <FieldSet name="variant.classification" label="Classification"/>
          <FieldSet as="textarea" name="variant.classificationEvidence" label="Classification Evidence"/>

          <h2>Report</h2>
          <FieldSet as="textarea" name="result.resultSummary" label="Result summary"/>
          <FieldSet as="textarea" name="result.furtherTesting" label="Further testing"/>
          <FieldSet as="textarea" name="result.testMethodology" label="Test Methodology"/>
          <FieldSet type="date" name="result.authorisingDate" label="Authorised date"/>
          <FieldSet name="result.authorisingScientist" label="Authorising scientist"/>
          <FieldSet name="result.authorisingScientistTitle" label="Authorising scientist title"/>
          <FieldSet type="date" name="result.reportingDate" label="Reporting date"/>
          <FieldSet name="result.reportingScientist" label="Reporting scientist"/>
          <FieldSet name="result.reportingScientistTitle" label="Reporting scientist title"/>
          <br/>
          <button type="submit">Submit</button>
        </Form>
      </Formik>
      {result !== "" && <textarea id="resultOutput" role="alert" rows={20} defaultValue={result}/>}
    </Card>
  );
}

export default ReportForm;
