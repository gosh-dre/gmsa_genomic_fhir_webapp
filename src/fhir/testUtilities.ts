import { checkResponseOK } from "./api";
import { FHIR_URL } from "./api.test";

export const sendBundle = async (bundle: Bundle) => {
  const sentBundle = await fetch(`${FHIR_URL}/`, {
    method: "POST",
    body: JSON.stringify(bundle),
    headers: {
      "Content-Type": "application/json",
    },
  });
  await new Promise((r) => setTimeout(r, 1500));
  return sentBundle;
};

export const getPatients = async (identifier?: string): Promise<Bundle> => {
  let url = `${FHIR_URL}/Patient`;
  if (identifier) url = `${FHIR_URL}/Patient?identifier=${identifier}`;
  const response = await fetch(url);
  return await checkResponseOK(response);
};

export const getObservations = async (identifier?: string): Promise<Bundle> => {
  let url = `${FHIR_URL}/Observation`;
  if (identifier) url = `${FHIR_URL}/Observation?identifier=${identifier}`;
  const response = await fetch(url);
  return await checkResponseOK(response);
};

export const deletePatients = async (patientId?: string) => {
  const patientData = await getPatients();
  if (!("entry" in patientData)) {
    console.debug("Nothing to delete; no patients in database");
    return;
  }
  if (patientId) {
    await deleteAndCascadeDelete([patientId]);
  } else {
    const patientIds = patientData.entry?.map((entry) => entry.resource?.id) as string[];
    await deleteAndCascadeDelete(patientIds);
  }

  // await new Promise((r) => setTimeout(r, 1500));
};

const deleteAndCascadeDelete = async (patientIds: string[]) => {
  console.debug(`deleting ids: ${patientIds}`);
  for (const patientId of patientIds) {
    const response = await fetch(`${FHIR_URL}/Patient/${patientId}?_cascade=delete`, {
      method: "DELETE",
    });
    await checkResponseOK(response);
  }
};
