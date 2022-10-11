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

    const readableResults = createReadableResults(patients, observations);

    setParsedObservations(readableResults);
  };

  const createReadableResults = (patients: any, observations: any) => {
    let readableResults: any = [];

    patients.forEach((patient: any, index: number) => {
      const patientId = patient.resource.id;
      const firstName = patient.resource.name[0].given[0];
      const lastName = patient.resource.name[0].family;

      const patientObservations = observations.filter((observation: any) => {
        const subjectIdLong = observation.resource.subject.reference;
        return subjectIdLong.includes(patientId);
      });
      console.log(patientObservations);

      // filter the observations by loinc code here instead of in the html?

      readableResults = [
        ...readableResults,
        { patientId: patientId, firstName: firstName, lastName: lastName, observations: patientObservations },
      ];
    });

    console.log(readableResults);
    return readableResults;
  };

  if (!parsedObservations) {
    return <div>Something went wrong fetching observations from the FHIR server. </div>;
  }

  console.log(parsedObservations);

  return (
    <>
      <ModalWrapper isError={modal?.isError} modalMessage={modal?.message} onClear={() => setModal(null)} />
      {isLoading && <LoadingSpinner asOverlay message={"Getting observations"} />}

      {parsedObservations.map((patient: any, index: number) => {
        return (
          <div className="observations-container">
            <h1>Observation {index}</h1>
            <div>First name: {patient.firstName}</div>
            <div>Last name: {patient.lastName}</div>

            <div>
              cDNA changes: {""}
              {patient.observations.map((observation: any, index: number) => {
                const isLast = patient.observations.length === index + 1;

                const res = observation.resource.component.map((component: any) => {
                  const loincCode = "48004-6";
                  if (component.code.coding[0].code === loincCode) {
                    return component.valueCodeableConcept.coding[0].display;
                  }
                });

                return (
                  <span>
                    {res}
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
