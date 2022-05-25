import {patientSchema} from "../components/reports/formDataValidation";
import {createPatientEntry} from "./resources";

/**
 * Create a report bundle
 * @param patient FHIR patient entity
 */
export const bundleRequest = (patient: typeof patientSchema) => {
  return {
    url: "/",
    method: "POST",
    headers: {'Content-Type': 'application/fhir+json;charset=UTF-8'},
    body: JSON.stringify(createBundle(patient)),
  };
}

export const createBundle = (patient: typeof patientSchema) => {
  const mrn = patient?.identifier?.at(0)?.value;
  const patientEntry = createPatientEntry(patient);

  return {
    resourceType: "Bundle",
    type: "transaction",
    entry: [{
      resource: patientEntry,
      resourceType: "Patient",
      request: {method: "PUT", url: `Patient?identifier=${mrn}`}
    }]
  };
}

