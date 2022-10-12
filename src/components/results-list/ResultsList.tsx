import { FC, useContext, useEffect, useState } from "react";
import { FhirContext } from "../fhir/FhirContext";

import LoadingSpinner from "../UI/LoadingSpinner";
import ModalWrapper from "../UI/ModalWrapper";
import { ModalState } from "../UI/ModalWrapper";

const FHIR_URL = process.env.REACT_APP_FHIR_URL;

const ResultsList: FC = () => {
  const ctx = useContext(FhirContext);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [parsedResults, setParsedResults] = useState<any>(null);

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

  const parseResults = (entries: any) => {
    // extract patients from the data
    const patients = entries.filter((entry: any) => {
      return entry.fullUrl.includes("Patient");
    });

    // extract observations from the data
    const observations = entries.filter((entry: any) => {
      return entry.fullUrl.includes("Observation");
    });

    const readableResults = createReadableResults(patients, observations);
    return readableResults;
  };

  const createReadableResults = (patients: any, observations: any) => {
    let readableResults: any = [];

    // extract the required data and store in a trimmed down data structure
    patients.forEach((patient: any) => {
      const patientId = patient.resource.id;
      const firstName = patient.resource.name[0].given[0];
      const lastName = patient.resource.name[0].family;

      // return observations belonging to a patient based on the patient ID
      const patientObservations = observations.filter((observation: any) => {
        const subjectIdLong = observation.resource.subject.reference;
        return subjectIdLong.includes(patientId);
      });

      // extract required data from each observation
      let trimmedObservations: any = [];
      patientObservations.forEach((observation: any) => {
        let trimmedObservation = observation.resource.component.filter((component: any) => {
          const loincCode = "48004-6";
          if (component.code.coding[0].code === loincCode) {
            return component.valueCodeableConcept.coding[0].display;
          }
        });
        trimmedObservation = { ...trimmedObservation[0], id: observation.resource.id };

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

  console.log(parsedResults);

  return (
    <>
      <ModalWrapper isError={modal?.isError} modalMessage={modal?.message} onClear={() => setModal(null)} />
      {isLoading && <LoadingSpinner asOverlay message={"Getting observations..."} />}

      {parsedResults.map((patient: any, index: number) => {
        return (
          <div key={`${patient.id}-${index}`} className="observations-container">
            <h1>Observation {index}</h1>
            <div>First name: {patient.firstName}</div>
            <div>Last name: {patient.lastName}</div>

            <div>
              cDNA changes: {""}
              {patient.observations.map((observation: any, index: number) => {
                const isLast = patient.observations.length === index + 1;

                return (
                  <span key={`${observation.id}-${index}`}>
                    {observation.valueCodeableConcept.coding[0].display}
                    {!isLast && ", "}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ResultsList;
