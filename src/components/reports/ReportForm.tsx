import React, {useState} from "react";
import {Form, Formik} from 'formik';
import * as Yup from "yup"

import Card from "../UI/Card";
import classes from "./ReportForm.module.css";
import {addressSchema, patientSchema, reportDetailSchema, sampleSchema, variantSchema} from "./formDataValidation";
import FieldSet from "./FieldSet";

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
    mrn: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    familyNumber: "",
  },
  sample: {
    specimenCode: "",
    specimenType: "",
    collectionDate: "",
    reasonForTestCode: "",
    reasonForTestText: "",
  },
  variant: {
    gene: "",
    genomicHGVS: "",
    inheritanceMethod: "",
    classification: "",
    proteinHGVS: "",
    referenceNucleotide: "",
    transcript: "",
    variantNucleotide: "",
    zygosity: "",
    classificationEvidence: "",
  },
  result: {
    resultSummary: "",
    authorisingDate: "",
    authorisingScientist: "",
    authorisingScientistTitle: "",
    furtherTesting: "",
    reportingDate: "",
    reportingScientist: "",
    reportingScientistTitle: "",
    testMethodology: "",
  }
};


const ReportForm = () => {

  const [result, setResult] = useState('')
  return (
    <Card>
      <h1>Add a new report</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={FormValidation}
        onSubmit={(values, actions) => {
          setResult(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
        }}
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

          {result !== "" && <textarea id="resultOutput" role="alert" rows={20} defaultValue={result}/>}
        </Form>
      </Formik>
    </Card>
  );
}

export default ReportForm;
