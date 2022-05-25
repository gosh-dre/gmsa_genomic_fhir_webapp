import {Patient} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/patient";

/**
 * Create a report bundle
 * @param patient FHIR patient entity
 */
export const bundleRequest = (patient: Patient) => {
  return {
    url: "/",
    method: "POST",
    headers: {'Content-Type': 'application/fhir+json;charset=UTF-8'},
    body: JSON.stringify(createBundle(patient)),
  };
}

export const createBundle = (patient: Patient) => {
  const mrn = patient?.identifier?.at(0)?.value;

  return {
    resourceType: "Bundle",
    type: "transaction",
    entry: [{
      resource: patient,
      resourceType: "Patient",
      request: {method: "PUT", url: `Patient?identifier=${mrn}`}
    }]
  };
}

