import ReportForm from "../components/reports/ReportForm";
import { FC } from "react";
import { FhirProvider } from "../components/fhir/FhirContext";

const NewReport: FC = () => {
  return (
    <FhirProvider>
      <ReportForm />
    </FhirProvider>
  );
};

export default NewReport;
