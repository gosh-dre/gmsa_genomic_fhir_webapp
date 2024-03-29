import { FC, useContext, useState } from "react";
import { FhirContext } from "../fhir/FhirContext";
import { Patient } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";

import LoadingSpinner from "../UI/LoadingSpinner";
import ModalWrapper, { ModalState } from "../UI/ModalWrapper";

import { ParsedResultsModel, TrimmedObservation } from "./ResultsDataFetcher";
import classes from "./ResultsList.module.css";

interface Props {
  results: ParsedResultsModel;
}

const ResultsList: FC<Props> = (props) => {
  const ctx = useContext(FhirContext);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { results } = props;

  const checkCascadeTestingHandler = async (overallInterpretation: string, familyNumber?: string) => {
    if (!familyNumber) {
      setModal({
        message: "This patient has no family number recorded.",
        isError: false,
      });
      return;
    }
    const observationQueryUrl = `/Patient?identifier=${familyNumber}`;

    setIsLoading(true);

    ctx.client
      ?.request(observationQueryUrl)
      .then((response) => {
        if (!response.entry) {
          setModal({
            message: "No patients returned from the fhir query. Please check that the identifier is correct",
            isError: false,
          });
          return;
        }

        displayCascadeAdvice(response.entry, overallInterpretation);
      })
      .catch((error) => {
        setModal({
          message: "Something went wrong fetching patients from the FHIR server.",
          isError: true,
        });
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const displayCascadeAdvice = (patients: Patient[], overallInterpretation: string) => {
    if (overallInterpretation !== "Positive") {
      setModal({
        message: `Patient has no pathogenic variants reported`,
        isError: false,
      });
      return;
    }

    if (patients.length === 1) {
      setModal({
        message: `Patient has a known pathogenic variant, please offer cascade testing to family. Currently this is the only family member with a test result.`,
        isError: false,
      });
    }

    if (patients.length > 1) {
      setModal({
        message: `Cascade testing has been performed for this patient. No need for any further action.`,
        isError: false,
      });
    }
  };

  if (!results || results.length === 0) {
    return <div> No results were returned from the fhir query. </div>;
  }

  return (
    <>
      <ModalWrapper isError={modal?.isError} modalMessage={modal?.message} onClear={() => setModal(null)} />
      {isLoading && <LoadingSpinner asOverlay message={"Getting observations..."} />}

      <h1>Familial hypercholesterolemia patient results</h1>

      <table className={classes["results-table"]}>
        <thead>
          <tr>
            <th>First name</th>
            <th>Last name</th>
            <th>cDNA change(s)</th>
            <th>Overall interpretation</th>
          </tr>
        </thead>
        <tbody>
          {results.map((patient, index) => {
            return (
              <tr
                key={`${patient.patientId}-${index}`}
                onClick={() => checkCascadeTestingHandler(patient.overallInterpretation, patient.familyIdentifier)}
              >
                <td>{patient.firstName}</td>
                <td>{patient.lastName}</td>
                <td>
                  {patient.observations.map((observation: TrimmedObservation, index) => {
                    const isLast = patient.observations.length === index + 1;

                    return (
                      <span key={`${observation.observationId}-${index}`}>
                        {observation.cDnaChange}
                        {!isLast && ", "}
                      </span>
                    );
                  })}
                </td>
                <td>{patient.overallInterpretation}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default ResultsList;
