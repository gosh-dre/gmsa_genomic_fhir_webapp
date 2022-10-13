import { FC } from "react";
import { FhirProvider } from "../components/fhir/FhirContext";

import ResultsDataFetcher from "../components/results-list/ResultsDataFetcher";

const Results: FC = () => {
  return (
    <FhirProvider>
      <ResultsDataFetcher />
    </FhirProvider>
  );
};

export default Results;
