import { FC } from "react";

import { ParsedResultsModel, TrimmedObservation } from "./ResultsDataFetcher";

import classes from "./ResultsList.module.css";

interface Props {
  results: ParsedResultsModel;
}

const ResultsList: FC<Props> = (props) => {
  const { results } = props;

  const checkCascadeTesting = (patientIdentifier: string) => {
    console.log(patientIdentifier);
  };

  if (!results || results.length === 0) {
    return <div>No results were returned from the fhir query. </div>;
  }

  console.log(results);

  return (
    <>
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
          {results.map((patient, index) => {
            return (
              <tr
                key={`${patient.patientId}-${index}`}
                onClick={() => checkCascadeTesting(patient.officialPatientIdentifier)}
              >
                <td>{patient.firstName}</td>
                <td>{patient.lastName}</td>
                <td>
                  {patient.observations.map((observation: { [key: string]: any }, index) => {
                    const isLast = patient.observations.length === index + 1;

                    return (
                      <span key={`${observation.observationId}-${index}`}>
                        {observation.cDnaChange}
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
