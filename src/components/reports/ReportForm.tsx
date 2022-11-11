import { FC, useContext, useRef, useState } from "react";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import * as Yup from "yup";
import { FhirContext } from "../fhir/FhirContext";

import Card from "../UI/Card";
import classes from "./ReportForm.module.css";
import { addressSchema, patientSchema, reportDetailSchema, sampleSchema, variantsSchema } from "./formDataValidation";
import { bundleRequest, getErrors } from "../../fhir/api";
import Patient from "./formSteps/Patient";
import Sample from "./formSteps/Sample";
import Variant from "./formSteps/Variant";
import Report from "./formSteps/Report";
import Confirmation from "./formSteps/Confirmation";
import FormStepBtn from "../UI/FormStepBtn";
import { RequiredCoding } from "../../code_systems/types";
import ModalWrapper, { ModalState } from "../UI/ModalWrapper";
import { useNavigate } from "react-router-dom";

const PatientAndAddressValidation = Yup.object({
  address: addressSchema.required(),
  patient: patientSchema.required(),
});

const SampleValidation = Yup.object({
  sample: sampleSchema.required(),
});

const VariantValidation = Yup.object({
  variant: variantsSchema.required(),
});

const ResultValidation = Yup.object({
  result: reportDetailSchema.required(),
});

const FormValidation = PatientAndAddressValidation.concat(SampleValidation)
  .concat(VariantValidation)
  .concat(ResultValidation);

export type FormValues = Yup.InferType<typeof FormValidation>;

const validators = [PatientAndAddressValidation, SampleValidation, VariantValidation, ResultValidation];

const steps = ["patient & Address", "sample", "variant", "result", "confirmation"];

type Props = {
  initialValues: FormValues;
};

type SetFieldValue = (field: string, value: any, shouldValidate?: boolean) => void;

const ReportForm: FC<Props> = (props: Props) => {
  const [modal, setModal] = useState<ModalState | null>(null);
  const [formStep, setFormStep] = useState(0);
  const [reportedGenes, setReportedGenes] = useState<RequiredCoding[]>([]);
  const isLastStep = formStep === steps.length - 1;
  const ctx = useContext(FhirContext);
  const formRef = useRef<FormikProps<FormValues>>(null);
  const navigate = useNavigate();

  const submitForm = (values: FormValues, actions: FormikHelpers<FormValues>) => {
    const bundle = bundleRequest(values, reportedGenes);

    const resourceList = JSON.parse(bundle.body).entry.map((entry: any) => entry.resource.resourceType);

    ctx.client
      ?.request(bundle)
      .then((response) => {
        console.debug(bundle, response);
        const errors = getErrors(response, resourceList);
        if (errors.length === 0) {
          navigate("/", { replace: true });
          console.debug("Redirected to new form");
        } else {
          const errorsTable = (
            <>
              <table className={classes["errors-table"]}>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Resource</th>
                    <th>Information</th>
                  </tr>
                </thead>
                <tbody>
                  {errors.map((error, i) => (
                    <tr key={i}>
                      <td>{error.errorCode}</td>
                      <td>{error.resourceType}</td>
                      <td>{error.diagnostics}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          );
          setModal({ message: errorsTable, isError: true });
        }
      })
      .catch((error) => {
        console.error(error);
        setModal({
          message: "Something went wrong submitting the bundle. Please try again later.",
          isError: true,
        });
      });
    actions.setSubmitting(false);
  };

  const handleSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
    if (formStep === steps.length - 1) {
      submitForm(values, actions);
      return;
    }
    // validate form fields
    actions.setTouched({});
    actions.setSubmitting(false);

    setFormStep(formStep + 1);
  };

  const prevStep = () => {
    if (formStep === 0) return;
    setFormStep(formStep - 1);
  };

  const returnStepContent = (setFieldValue: SetFieldValue, values: FormValues) => {
    switch (formStep) {
      case 0:
        return <Patient setFieldValue={setFieldValue} />;
      case 1:
        return <Sample />;
      case 2:
        return <Variant values={values} setFieldValue={setFieldValue} setReportFormGenes={setReportedGenes} />;
      case 3:
        return <Report />;
      case 4:
        return <Confirmation formRef={formRef} />;
      default:
        <div>Not found</div>;
    }
  };

  return (
    <>
      <ModalWrapper isError={modal?.isError} modalMessage={modal?.message} onClear={() => setModal(null)} />

      <Card>
        <h1>Add a new report</h1>

        <Formik
          enableReinitialize={true}
          initialValues={props.initialValues}
          validationSchema={validators[formStep]}
          onSubmit={handleSubmit}
          innerRef={formRef}
        >
          {({ setFieldValue, isSubmitting, values }) => (
            <Form role="form" autoComplete="off" className={classes.form}>
              <h2 className={classes["step-header"]}>
                Form step {formStep + 1} of {steps.length}
              </h2>

              {returnStepContent(setFieldValue, values)}

              <FormStepBtn
                formStep={formStep}
                prevStep={prevStep}
                isLastStep={isLastStep}
                isSubmitting={isSubmitting}
              />
            </Form>
          )}
        </Formik>
      </Card>
    </>
  );
};

export default ReportForm;
