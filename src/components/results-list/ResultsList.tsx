import { FC, useContext, useEffect, useState } from "react";
import { FhirContext } from "../fhir/FhirContext";

import LoadingSpinner from "../UI/LoadingSpinner";
import ModalWrapper from "../UI/ModalWrapper";
import { ModalState } from "../UI/ModalWrapper";

import classes from "./ResultsList.module.css";

const FHIR_URL = process.env.REACT_APP_FHIR_URL;
type patientResult = {
  firstName: string;
  lastName: string;
  patientId: string;
  observations: { [key: string]: any }[]; // using any since it is a deeply nested object from an external api}
};
type parsedResultsModel = patientResult[];

const ResultsList: FC = () => {
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
    console.log(entries);
    // extract patients from the data
    const patients = entries.filter((entry: { [key: string]: any }) => {
      return entry.fullUrl.includes("Patient");
    });

    // extract observations from the data
    const observations = entries.filter((entry: { [key: string]: any }) => {
      return entry.fullUrl.includes("Observation");
    });

    const readableResults = createReadableResults(patients, observations);
    return readableResults;
  };

  const createReadableResults = (patients: { [key: string]: any }[], observations: { [key: string]: any }[]) => {
    let readableResults: parsedResultsModel = [];

    // extract the required data and store in a trimmed down data structure
    patients.forEach((patient: { [key: string]: any }) => {
      const patientId = patient.resource.id;
      const firstName = patient.resource.name[0].given[0];
      const lastName = patient.resource.name[0].family;

      // return observations belonging to a patient based on the patient ID
      const patientObservations = observations.filter((observation: { [key: string]: any }) => {
        const subjectIdLong = observation.resource.subject.reference;
        return subjectIdLong.includes(patientId);
      });

      // extract required data from each observation
      let trimmedObservations: { [key: string]: any }[] = [];
      patientObservations.forEach((observation: { [key: string]: any }) => {
        let trimmedObservation = observation.resource.component.filter((component: { [key: string]: any }) => {
          const loincCode = "48004-6";
          if (component.code.coding[0].code === loincCode) {
            return component.valueCodeableConcept.coding[0].display;
          }
        });
        trimmedObservation = { ...trimmedObservation[0], observationId: observation.resource.id };

        trimmedObservations = [...trimmedObservations, trimmedObservation];
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

      <h1>Patient results table</h1>

      <table className={classes["results-table"]}>
        <thead>
          <tr>
            <th>First name</th>
            <th>Last name</th>
            <th>cDNA changes</th>
          </tr>
        </thead>
        <tbody>
          {parsedResults.map((patient, index) => {
            return (
              <tr key={`${patient.patientId}-${index}`}>
                <td>{patient.firstName}</td>
                <td>{patient.lastName}</td>
                <td>
                  {patient.observations.map((observation: { [key: string]: any }, index) => {
                    const isLast = patient.observations.length === index + 1;

                    return (
                      <span key={`${observation.observationId}-${index}`}>
                        {observation.valueCodeableConcept.coding[0].display}
                        {!isLast && ", "}
                      </span>
                    );
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default ResultsList;
