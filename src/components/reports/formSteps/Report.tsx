import { FC } from "react";

import FieldSet from "../FieldSet";

const Report: FC = () => {
  return (
    <>
      <h2>Report</h2>
      <FieldSet as="textarea" name="result.resultSummary" label="Result summary" />
      <FieldSet as="textarea" name="result.clinicalConclusion" label="Clinical Conclusion" />
      <FieldSet as="textarea" name="result.citation" label="Citation" />
      <FieldSet as="textarea" name="result.furtherTesting" label="Further testing" />
      <FieldSet as="textarea" name="result.testMethodology" label="Test Methodology" />
      <FieldSet type="date" name="result.authorisingDate" label="Authorised date" />
      <FieldSet name="result.authorisingScientist" label="Authorising scientist" />
      <FieldSet name="result.authorisingScientistTitle" label="Authorising scientist title" />
      <FieldSet type="date" name="result.reportingDate" label="Reporting date" />
      <FieldSet name="result.reportingScientist" label="Reporting scientist" />
      <FieldSet name="result.reportingScientistTitle" label="Reporting scientist title" />
    </>
  );
};

export default Report;
