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
  const [parsedObservations, setParsedObservations] = useState<any>(null);

  useEffect(() => {
    const observationQueryUrl = `${FHIR_URL}/Observation?_profile=http://hl7.org/fhir/uv/genomics-reporting/StructureDefinition/variant&_include=Observation:subject`;

    setIsLoading(true);

    const requestObservations = async () => {
      ctx.client
        ?.request(observationQueryUrl)
        .then((response) => {
          console.log(response);
          parseObservations(response.entry);
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

  // const obervations = [
  //   { fname: "john", lname: "doe", data: { 0: "data1", 1: "data2" } },
  //   { fname: "jane", lname: "doe", data: { 0: "data1", 1: "data2" } },
  // ];

  const parseObservations = (rawObservations: any) => {
    console.log(rawObservations);

    let parsedObservations: any = [];

    const patients = rawObservations.filter((element: any) => {
      const url = element.fullUrl;
      const regex = /Patient/;
      const isPatient = url.match(regex);

      if (isPatient) return element;
    });

    const observations = rawObservations.filter((element: any) => {
      const url = element.fullUrl;
      const regex = /Observation/;
      const isObservation = url.match(regex);

      if (isObservation) return element;
    });

    console.log(patients);
    console.log(observations);

    // loop through each patient
    // for each patient we extract the patient id
    // we then loop through each observation
    // if the subject of the observation matches the patient id, then we add the observation to the current patient data structure

    patients.forEach((patient: any, index: number) => {
      let newPatientObj: any = patient;
      let patientObservations: any = [];

      const patientId = patient.resource.id;

      observations.forEach((observation: any, index: number) => {
        const subjectIdLong = observation.resource.subject.reference;
        const parsedSubjectId = subjectIdLong.split("Patient/")[1];

        if (patientId === parsedSubjectId) {
          patientObservations = [...patientObservations, observation];

          newPatientObj = {
            ...newPatientObj,
            ["observations"]: patientObservations,
          };
          console.log(newPatientObj);
        }
      });

      parsedObservations = [...parsedObservations, newPatientObj];
    });

    setParsedObservations(parsedObservations);
  };

  if (!parsedObservations) {
    return <div>Something went wrong fetching observations from the FHIR server. </div>;
  }

  console.log(parsedObservations);

  return (
    <>
      <ModalWrapper isError={modal?.isError} modalMessage={modal?.message} onClear={() => setModal(null)} />
      {isLoading && <LoadingSpinner asOverlay message={"Getting observations"} />}

      {parsedObservations.map((obervation: any, index: number) => {
        return (
          <div className="observations-container">
            <h1>Observation {index}</h1>
            <div>First name: {obervation.resource.name[0].given[0]}</div>
            <div>Last name: {obervation.resource.name[0].family}</div>
            <div>
              cDNA changes:
              {obervation.observations.map((innerObservation: any) => {
                const res = innerObservation.resource.component.map((component: any) => {
                  const loincCode = "48004-6";
                  if (component.code.coding[0].code === loincCode) component.valueCodeableConcept.coding[0].display;
                });

                return <span> {res}, </span>;
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ResultsList;
