import ReportForm from "../components/reports/ReportForm";
import { FC } from "react";
import { FhirProvider } from "../components/fhir/FhirContext";
import { initialWithNoVariant } from "../components/reports/FormDefaults";

const NewReport: FC = () => {
  return (
    <FhirProvider>
      <ReportForm initialValues={initialWithNoVariant} />
    </FhirProvider>
  );
};

export default NewReport;
