import { FC, useEffect, useState, useContext } from "react";
import { FhirContext } from "../fhir/FhirContext";

import LoadingSpinner from "../UI/LoadingSpinner";
import ModalWrapper from "../UI/ModalWrapper";
import { ModalState } from "../UI/ModalWrapper";
import ResultsList from "../results-list/ResultsList";

import { Patient, Observation } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";

const FHIR_URL = process.env.REACT_APP_FHIR_URL;

type trimmedObservation = { cDnaChange: string | undefined; observationId: string | undefined };
type patientResult = {
  firstName: string | undefined;
  lastName: string | undefined;
  patientId: string | undefined;
  observations: trimmedObservation[];
};
export type parsedResultsModel = patientResult[];

const ResultsDataFetcher: FC = () => {
  const ctx = useContext(FhirContext);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [parsedResults, setParsedResults] = useState<parsedResultsModel | null>(null);

  useEffect(() => {
    const observationQueryUrl = `${FHIR_URL}/Observation?_profile=http://hl7.org/fhir/uv/genomics-reporting/StructureDefinition/variant&_include=Observation:subject`;

    setIsLoading(true);

    const requestObservations = async () => {
      ctx.client
        ?.request(observationQueryUrl)
        .then((response) => {
          const parsedResults = parseResults(response.entry);
          setParsedResults(parsedResults);
        })
        .catch((error) => {
          setModal({
            message: "Something went wrong fetching observations from the FHIR server.",
            isError: true,
          });
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    requestObservations();
  }, [ctx]);

  const parseResults = (entries: { [key: string]: any }[]) => {
    // extract patients from the data
    const patients = entries
      .filter((entry) => {
        return entry.fullUrl.includes("Patient");
      })
      .map((entry) => entry.resource as Patient);

    // extract observations from the data
    const observations = entries
      .filter((entry) => {
        return entry.fullUrl.includes("Observation");
      })
      .map((entry) => entry.resource as Observation);

    const readableResults = createReadableResults(patients, observations);

    return readableResults;
  };

  const createReadableResults = (patients: Patient[], observations: Observation[]) => {
    let readableResults: parsedResultsModel = [];

    // extract the required data and store in a trimmed down data structure
    patients.forEach((patient) => {
      if (!patient.id || !patient.name || !patient.name[0].given) return;

      const patientId = patient.id;
      const firstName = patient.name[0].given[0];
      const lastName = patient.name[0].family;

      // return observations belonging to a patient based on the patient ID
      const patientObservations = observations.filter((observation) => {
        if (!observation.subject || !observation.subject.reference) return;

        const subjectIdLong = observation.subject.reference;

        return subjectIdLong.includes(patientId);
      });

      // extract required data from each observation
      let trimmedObservations: trimmedObservation[] = [];
      patientObservations.forEach((observation) => {
        if (!observation || !observation.component) return;

        const trimmedObservation = observation.component.filter((component) => {
          const loincCode = "48004-6";
          if (component?.code?.coding?.[0].code === loincCode) {
            return component?.valueCodeableConcept?.coding?.[0].display;
          }
        });

        const cDnaChange = trimmedObservation[0].valueCodeableConcept?.coding?.[0].display;

        trimmedObservations = [...trimmedObservations, { cDnaChange: cDnaChange, observationId: observation.id }];
      });

      readableResults = [
        ...readableResults,
        { patientId: patientId, firstName: firstName, lastName: lastName, observations: trimmedObservations },
      ];
    });

    return readableResults;
  };

  if (!parsedResults) {
    return <div>Getting observations.</div>;
  }

  return (
    <>
      <ModalWrapper isError={modal?.isError} modalMessage={modal?.message} onClear={() => setModal(null)} />
      {isLoading && <LoadingSpinner asOverlay message={"Getting observations..."} />}

      <ResultsList results={parsedResults} />
    </>
  );
};

export default ResultsDataFetcher;
