import { useContext, useRef, useState } from "react";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import * as Yup from "yup";
import { FhirContext } from "../fhir/FhirContext";
import { Patient as PatientClass } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/patient";

import Card from "../UI/Card";
import classes from "./ReportForm.module.css";
import { addressSchema, patientSchema, reportDetailSchema, sampleSchema, variantsSchema } from "./formDataValidation";
import { bundleRequest } from "../../fhir/api";
import Patient from "./formSteps/Patient";
import Sample from "./formSteps/Sample";
import Variant from "./formSteps/Variant";
import Report from "./formSteps/Report";
import Confirmation from "./formSteps/Confirmation";

const FormValidation = Yup.object()
  .shape({
    address: addressSchema.required(),
    patient: patientSchema.required(),
    sample: sampleSchema.required(),
    variant: variantsSchema.required(),
    result: reportDetailSchema.required(),
  })
  .required();

export type FormValues = Yup.InferType<typeof FormValidation>;

const initialValues: FormValues = {
  address: {
    name: "London North Genomic Laboratory Hub",
    streetAddress: [""],
    city: "",
    country: "",
    postCode: "",
  },
  patient: {
    mrn: "969977",
    firstName: "Donald",
    lastName: "Duck",
    dateOfBirth: new Date("2012-03-04"),
    gender: PatientClass.GenderEnum.Male,
    familyNumber: "Z409929",
  },
  sample: {
    specimenCode: "19RG-183G0127",
    // will need codes here too - but probably best to load all possible codes and then query
    specimenType: "Venus blood specimen",
    collectionDate: new Date("2019-06-04"),
    reasonForTestCode: "230387008",
    reasonForTestText:
      "Sequence variant screening in Donald Duck because of epilepsy and atypical absences. " +
      "An SLC2A1 variant is suspected.",
  },
  variant: [
    // should initially be set to empty array but for development keeping details in
    {
      gene: "GNAO1",
      genomicHGVS: "c.119G>T",
      inheritanceMethod: "Autosomal dominant",
      // will also need a code
      classification: "Likely Pathogenic",
      proteinHGVS: "p.(Gly40Val)",
      transcript: "NM_006516.2",
      zygosity: "hetezygote",
      classificationEvidence:
        "absent from the gnomAD population database (PM2_Moderate)." +
        "affects a gene with a low tolerance for missense variation (PP2_Supporting). " +
        "predicted to be deleterious by in silico prediction tools (PP3_Supporting). " +
        "similar variants affecting the same amino acid c.118G>A p.(Gly40Arg), " +
        "c.118G>C p.(Gly40Arg), c.118G>T p.(Gly40Trp) & c.119G>A p.(Gly40Glu) " +
        "have been previously reported in the literature (1-2) (PM5_Moderate) reported on ClinVar as likely pathogenic.",
      confirmedVariant: false,
      comment: "This variant occurs in a recessive gene that has been 100% sequenced and no second variant identified.",
    },
  ],
  result: {
    resultSummary:
      "Next generation sequence analysis indicates that Duck Donald is heterozygous for the GNAO1 " +
      "c.119G>T p.(Gly40Val) likely pathogenic variant that has been confirmed by Sanger sequence analysis " +
      "(see technical information below).",
    geneInformation:
      "NAO1: Heterozygous pathogenic variants cause EIEE17 (MIM 615473) " +
      "or neurodevelopmental disorder with involuntary movements without epilepsy (MIM 617493). " +
      "Clinical features range from severe motor and cognitive impairment with marked choreoathetosis, " +
      "self-injurious behaviour and epileptic encephalopathy, to a milder course with moderate developmental delay, " +
      "complex stereotypies (facial dyskinesia) and mild epilepsy.",
    authorisingDate: new Date("2021-04-25"),
    authorisingScientist: "Lucy Jones",
    authorisingScientistTitle: "Consultant Clinical Scientist",
    furtherTesting:
      "Testing of Donald Duck's parents is recommended to determine whether the GNAO1 " +
      "c.119G>T p.(Gly40Val) likely pathogenic variant has arisen de novo and to assess the recurrence risk. " +
      "Please include clinical information for the parents. " +
      "A referral to their local clinical genetics service may be appropriate for this family.",
    reportingDate: new Date("2021-04-25"),
    reportingScientist: "Ana Pietra",
    reportingScientistTitle: "Clinical Scientist",
    testMethodology:
      "Screening of 82 genes associated with severe delay and seizures " +
      "... Variants are classified using the ACMG/AMP guidelines (Richards et al 2015 Genet Med) " +
      "/ACGS Best Practice guidelines (2019).",
    clinicalConclusion: "Confirms the diagnosis of Childhood-nset epileptic encephalopathy (EEOC).",
  },
};

const ReportForm = () => {
  const [result, setResult] = useState("");
  const [formStep, setFormStep] = useState(1);
  const [variantExists, setVariantExists] = useState(true);
  const ctx = useContext(FhirContext);
  const formRef = useRef<FormikProps<FormValues>>(null);

  const onSuccessfulSubmitHandler = (values: FormValues, actions: FormikHelpers<FormValues>) => {
    const bundle = bundleRequest(values);

    setResult(JSON.stringify(JSON.parse(bundle.body), null, 2));

    ctx.client
      ?.request(bundle)
      .then((response) => console.debug("Bundle submitted", bundle, response))
      .catch((error) => console.error(error));
    actions.setSubmitting(false);
  };

  const nextStep = () => {
    if (formStep === 5) return;
    setFormStep(formStep + 1);
  };

  const prevStep = () => {
    if (formStep === 1) return;
    setFormStep(formStep - 1);
  };

  const returnStepContent = (setFieldValue: any) => {
    switch (formStep) {
      case 1:
        return <Patient nextStep={nextStep} prevStep={prevStep} setFieldValue={setFieldValue} />;
      case 2:
        return <Sample nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return (
          <Variant
            nextStep={nextStep}
            prevStep={prevStep}
            variantExists={variantExists}
            setVariantExists={setVariantExists}
            setFieldValue={setFieldValue}
          />
        );
      case 4:
        return <Report nextStep={nextStep} prevStep={prevStep} />;
      case 5:
        return <Confirmation nextStep={nextStep} prevStep={prevStep} formRef={formRef} />;
      default:
        console.log("multi step form");
    }
  };

  return (
    <Card>
      <h1>Add a new report</h1>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={FormValidation}
        onSubmit={onSuccessfulSubmitHandler}
        innerRef={formRef}
      >
        {({ setFieldValue }) => (
          <Form role="form" className={classes.form}>
            <h2 className={classes["step-header"]}>Form step {formStep} of 5</h2>
            {returnStepContent(setFieldValue)}
          </Form>
        )}
      </Formik>
      {result !== "" && <textarea id="resultOutput" role="alert" rows={80} cols={100} defaultValue={result} />}
    </Card>
  );
};

export default ReportForm;
