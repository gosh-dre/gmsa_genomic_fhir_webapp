import { FC } from "react";
import { FhirProvider } from "../components/fhir/FhirContext";



const ResultsList: FC = () => {


  return (
    <FhirProvider>
      <div>results list</div>
    </FhirProvider>
  );
};

export default ResultsList;
