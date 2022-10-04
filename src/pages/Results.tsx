import { FC } from "react";
import { FhirProvider } from "../components/fhir/FhirContext";

import ResultsList from "../components/results-list/ResultsList";

const Results: FC = () => {
  return (
    <FhirProvider>
      <ResultsList />
    </FhirProvider>
  );
};

export default Results;
