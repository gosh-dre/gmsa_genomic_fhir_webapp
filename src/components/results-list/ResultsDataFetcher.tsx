import { FC, useEffect, useState, useContext } from "react";
import { FhirContext } from "../fhir/FhirContext";

import LoadingSpinner from "../UI/LoadingSpinner";
import ModalWrapper from "../UI/ModalWrapper";
import { ModalState } from "../UI/ModalWrapper";
import ResultsList from "../results-list/ResultsList";

import { Patient, Observation } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";

export type TrimmedObservation = { cDnaChange: string; observationId: string };
type PatientResult = {
  patientId: string;
  officialPatientIdentifier: string;
  firstName: string;
  lastName: string;
  observations: TrimmedObservation[];
};
export type ParsedResultsModel = PatientResult[];

const HGVS_CDNA_LOINC = "48004-6";

const ResultsDataFetcher: FC = () => {
  const ctx = useContext(FhirContext);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [parsedResults, setParsedResults] = useState<ParsedResultsModel | null>(null);

  useEffect(() => {
    const observationQueryUrl = `Observation?_profile=http://hl7.org/fhir/uv/genomics-reporting/StructureDefinition/variant&_include=Observation:subject`;

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

  /**
   * Extracts and returns basic patient information from patient data structures and cDNA changes from observation data structures.
   * @param patients an array of patients
   * @param observations an array of patient observations
   */
  const createReadableResults = (patients: Patient[], observations: Observation[]) => {
    let readableResults: ParsedResultsModel = [];

    // extract the required data and store in a trimmed down data structure
    patients.forEach((patient) => {
      if (
        !patient.id ||
        !patient.identifier ||
        !patient.identifier[0].value ||
        !patient.name ||
        !patient.name[0].given ||
        !patient.name[0].family
      ) {
        return;
      }

      const patientId = patient.id;
      const officialPatientIdentifier = patient.identifier[0].value;
      const firstName = patient.name[0].given[0];
      const lastName = patient.name[0].family;

      // return observations belonging to a patient based on the patient ID
      const patientObservations = observations.filter((observation) => {
        if (!observation.subject?.reference) return;

        const subjectIdLong = observation.subject.reference;

        return subjectIdLong.includes(patientId);
      });

      if (!patientObservations || patientObservations.length === 0) {
        return;
      }

      // extract required data from each observation
      let trimmedObservations: TrimmedObservation[] = [];
      patientObservations.forEach((observation) => {
        if (!observation || !observation?.component || !observation?.id) {
          return;
        }

        const TrimmedObservation = observation.component.filter((component) => {
          if (
            !component ||
            !component?.code?.coding?.[0].code ||
            !component?.valueCodeableConcept?.coding?.[0].display
          ) {
            return;
          }

          if (component.code.coding[0].code === HGVS_CDNA_LOINC) {
            return component.valueCodeableConcept.coding[0].display;
          }
        });

        if (!TrimmedObservation?.[0].valueCodeableConcept?.coding?.[0].display) {
          return;
        }

        const cDnaChange = TrimmedObservation[0].valueCodeableConcept?.coding?.[0].display;

        trimmedObservations = [...trimmedObservations, { cDnaChange: cDnaChange, observationId: observation.id }];
      });

      readableResults = [
        ...readableResults,
        {
          patientId: patientId,
          officialPatientIdentifier: officialPatientIdentifier,
          firstName: firstName,
          lastName: lastName,
          observations: trimmedObservations,
        },
      ];
    });

    return readableResults;
  };

  if (!parsedResults) {
    return <div>Something went wrong getting observations. Please try again later.</div>;
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
