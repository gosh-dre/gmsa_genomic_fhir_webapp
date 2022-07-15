import ReportForm from "../components/reports/ReportForm";
import { FC } from "react";
import { FhirProvider } from "../components/fhir/FhirContext";
import { initialWithNoVariant, noValues } from "../components/reports/FormDefaults";

const NewReport: FC = () => {
  return (
    <FhirProvider>
      <ReportForm initialValues={noValues} />
    </FhirProvider>
  );
};

export default NewReport;
