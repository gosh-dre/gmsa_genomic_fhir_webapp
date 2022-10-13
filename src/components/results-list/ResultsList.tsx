import { FC } from "react";

import { parsedResultsModel } from "../../pages/Results";

import classes from "./ResultsList.module.css";

interface Props {
  results: parsedResultsModel;
}

const ResultsList: FC<Props> = (props) => {
  const { results } = props;

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
              <tr key={`${patient.patientId}-${index}`}>
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
