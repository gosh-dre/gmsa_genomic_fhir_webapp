import React, {useState} from "react";
import {Form, Field, Formik} from 'formik';
import Card from "../UI/Card";
import classes from "./ReportForm.module.css";
import {Address, Patient, ReportDetails, Sample, Variant} from "../../models/FormData";


interface FormValues {
  patient: Patient,
  address: Address,
  sample: Sample,
  variant: Variant,
  reportDetails: ReportDetails,
}


const ReportForm = () => {
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
      collectionDateTime: "",
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
    reportDetails: {
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

  const [result, setResult] = useState('')
  return (
    <Card>
      <h1>Add a new report</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          setResult(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
        }}
      >
        <Form className={classes.form}>
          <h2>Reporting laboratory (later as a dropdown)</h2>
          <label htmlFor="streetAddress">Street Address</label>
          <Field as="textarea" id="streetAddress" name="address.streetAddress"/>
          <label htmlFor="city">City</label>
          <Field id="city" name="address.city"/>
          <label htmlFor="postCode">Post Code</label>
          <Field id="postCode" name="address.postCode"/>
          <label htmlFor="country">Country</label>
          <Field id="country" name="address.country"/>

          <h2>Patient information</h2>
          <label htmlFor="mrn">MRN</label>
          <Field id="mrn" name="patient.mrn"/>
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <Field id="dateOfBirth" type="date" name="patient.dateOfBirth"/>
          <label htmlFor="firstName">First Name</label>
          <Field id="firstName" name="patient.firstName"/>
          <label htmlFor="lastName">Last Name</label>
          <Field id="lastName" name="patient.lastName"/>
          <label htmlFor="gender">Gender</label>
          <Field id="gender" name="patient.gender"/>
          <label htmlFor="familyNumber">Family Number</label>
          <Field id="familyNumber" name="patient.familyNumber"/>

          <h2>Sample</h2>
          <label htmlFor="specimenCode">Barcode</label>
          <Field id="specimenCode" name="sample.specimenCode"/>
          <label htmlFor="specimenType">Specimen Type</label>
          <Field id="specimenType" name="sample.specimenType"/>
          <label htmlFor="collectionDateTime">Sample collection</label>
          <Field id="collectionDateTime" type="date" name="sample.collectionDateTime"/>
          <label htmlFor="reasonForTestText">Reason for test</label>
          <Field id="reasonForTestText" name="sample.reasonForTestText"/>
          <label htmlFor="reasonForTestCode">Reason for test code</label>
          <Field id="reasonForTestCode" name="sample.reasonForTestCode"/>

          <h2>Variant</h2>
          <label htmlFor="gene">Gene Symbol</label>
          <Field id="gene" name="variant.gene"/>
          <label htmlFor="transcript">Transcript</label>
          <Field id="transcript" name="variant.transcript"/>
          <label htmlFor="referenceNucleotide">Reference Nucleotide</label>
          <Field id="referenceNucleotide" name="variant.referenceNucleotide"/>
          <label htmlFor="variantNucleotide">Variant Nucleotide</label>
          <Field id="variantNucleotide" name="variant.variantNucleotide"/>
          <label htmlFor="genomicHGVS">Genomic HGVS</label>
          <Field id="genomicHGVS" name="variant.genomicHGVS"/>
          <label htmlFor="proteinHGVS">Protein HGVS</label>
          <Field id="proteinHGVS" name="variant.proteinHGVS"/>
          <label htmlFor="zygosity">Zygosity</label>
          <Field id="zygosity" name="variant.zygosity"/>
          <label htmlFor="inheritanceMethod">Inhertiance Method</label>
          <Field id="inheritanceMethod" name="variant.inheritanceMethod"/>
          <label htmlFor="classification">Classification</label>
          <Field id="classification" name="variant.classification"/>
          <label htmlFor="classificationEvidence">Classification Evidence</label>
          <Field as="textarea" id="classificationEvidence" name="variant.classificationEvidence"/>

          <h2>Report</h2>
          <label htmlFor="resultSummary">Result summary</label>
          <Field as="textarea" id="resultSummary" name="result.resultSummary"/>
          <label htmlFor="furtherTesting">Further testing</label>
          <Field as="textarea" id="furtherTesting" name="result.furtherTesting"/>
          <label htmlFor="testMethodology">Test Methodology</label>
          <Field as="textarea" id="testMethodology" name="result.testMethodology"/>
          <label htmlFor="authorisingDate">Authorised date</label>
          <Field id="authorisingDate" type="date" name="result.authorisingDate"/>
          <label htmlFor="authorisingScientist">Authorising scientist</label>
          <Field id="authorisingScientist" name="result.authorisingScientist"/>
          <label htmlFor="authorisingScientistTitle">Authorising scientist title</label>
          <Field id="authorisingScientistTitle" name="result.authorisingScientistTitle"/>
          <label htmlFor="authorisingDate">Reporting date</label>
          <Field id="reportingDate" type="date" name="result.reportingDate"/>
          <label htmlFor="reportingScientist">Reporting scientist</label>
          <Field id="reportingScientist" name="result.reportingScientist"/>
          <label htmlFor="reportingScientistTitle">Reporting scientist title</label>
          <Field id="reportingScientistTitle" name="result.reportingScientistTitle"/>

          <br/>
          <button type="submit">Submit</button>

          {result !== "" && <textarea id="result" role="alert" rows={20} defaultValue={result}/>}
        </Form>
      </Formik>
    </Card>
  );
}

export default ReportForm;
