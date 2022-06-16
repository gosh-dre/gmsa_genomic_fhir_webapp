import { FC } from "react";

import FieldSet from "../FieldSet";
import FormStepBtn from "../../UI/FormStepBtn";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}

const Report: FC<Props> = (props) => {
  const { nextStep, prevStep } = props;

  return (
    <>
      <h2>Report</h2>
      <FieldSet as="textarea" name="result.resultSummary" label="Result summary" />
      <FieldSet as="textarea" name="result.furtherTesting" label="Further testing" />
      <FieldSet as="textarea" name="result.testMethodology" label="Test Methodology" />
      <FieldSet type="date" name="result.authorisingDate" label="Authorised date" />
      <FieldSet name="result.authorisingScientist" label="Authorising scientist" />
      <FieldSet name="result.authorisingScientistTitle" label="Authorising scientist title" />
      <FieldSet type="date" name="result.reportingDate" label="Reporting date" />
      <FieldSet name="result.reportingScientist" label="Reporting scientist" />
      <FieldSet name="result.reportingScientistTitle" label="Reporting scientist title" />

      <FormStepBtn nextStep={nextStep} prevStep={prevStep} showNext={true} showPrev={true} />
    </>
  );
};

export default Report;
