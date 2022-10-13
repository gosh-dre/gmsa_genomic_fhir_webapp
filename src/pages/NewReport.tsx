import ReportForm from "../components/reports/ReportForm";
import { FC } from "react";
import { initialWithNoVariant, noValues } from "../components/reports/FormDefaults";
import { FhirProvider } from "../components/fhir/FhirContext";

const PREFILLED_REPORT = process.env.REACT_APP_PREFILLED_REPORT;

const NewReport: FC = () => {
  let initialFormValues = noValues;
  if (PREFILLED_REPORT !== "false") {
    initialFormValues = initialWithNoVariant;
  }

  return (
    <FhirProvider>
      <ReportForm initialValues={initialFormValues} />
    </FhirProvider>
  );
};

export default NewReport;
