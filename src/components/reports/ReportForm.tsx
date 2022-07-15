import { FC, useContext, useRef, useState } from "react";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import * as Yup from "yup";
import { FhirContext } from "../fhir/FhirContext";

import Card from "../UI/Card";
import classes from "./ReportForm.module.css";
import { addressSchema, patientSchema, reportDetailSchema, sampleSchema, variantsSchema } from "./formDataValidation";
import { bundleRequest } from "../../fhir/api";
import Patient from "./formSteps/Patient";
import Sample from "./formSteps/Sample";
import Variant from "./formSteps/Variant";
import Report from "./formSteps/Report";
import Confirmation from "./formSteps/Confirmation";

const FormValidation = Yup.object({
  address: addressSchema.required(),
  patient: patientSchema.required(),
  sample: sampleSchema.required(),
  variant: variantsSchema.required(),
  result: reportDetailSchema.required(),
}).required();

export type FormValues = Yup.InferType<typeof FormValidation>;

type Props = {
  initialValues: FormValues;
};

const ReportForm: FC<Props> = (props: Props) => {
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
        initialValues={props.initialValues}
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
