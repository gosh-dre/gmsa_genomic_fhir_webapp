import ReportForm from "../components/reports/ReportForm";
import { FC } from "react";
import { FhirProvider } from "../components/fhir/FhirContext";
import { initialValues } from "../components/reports/FormDefaults";

const NewReport: FC = () => {
  return (
    <FhirProvider>
      <ReportForm initialValues={initialValues} />
    </FhirProvider>
  );
};

export default NewReport;
