import { FC, useContext, useEffect, useState } from "react";
import { FhirContext } from "../fhir/FhirContext";

const FHIR_URL = process.env.REACT_APP_FHIR_URL;

const ResultsList: FC = () => {
    const ctx = useContext(FhirContext);
    const [observationResults, setObservationResults] = useState(null);

    useEffect(() => {
        const observationQueryUrl = `${FHIR_URL}/Observation?_profile=http://hl7.org/fhir/uv/genomics-reporting/StructureDefinition/variant&_include=Observation:subject`

        const requestObservations = async () => {
            ctx.client
            ?.request(observationQueryUrl)
            .then((response) => {
                console.log(response);
                setObservationResults(response);
            })
            .catch((error) => console.error(error));
        }
        requestObservations();
    }, [ctx])

    return (
        <div>results list</div>
    );
};

export default ResultsList;
