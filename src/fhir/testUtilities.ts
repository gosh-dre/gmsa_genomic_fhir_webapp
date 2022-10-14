import { Bundle } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/bundle";
import { checkResponseOK } from "./api";

const FHIR_URL = process.env.REACT_APP_FHIR_URL || "";

export const createPractitioner = async (practitioner: any) => {
  const sendPractitioner = await fetch(`${FHIR_URL}/Practitioner`, {
    method: "POST",
    body: JSON.stringify(practitioner),
    headers: {
      "Content-Type": "application/json",
    },
  });
  await new Promise((r) => setTimeout(r, 1500));
  return sendPractitioner;
};

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

const getPractitioners = async (id?: string): Promise<Bundle> => {
  let url = `${FHIR_URL}/Practitioner`;
  if (id) url = `${FHIR_URL}/Practitioner/${id}`;
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

export const deletePractitioners = async (practitionerId?: string) => {
  const practitionerData = await getPractitioners();
  if (!("resource" in practitionerData)) {
    console.debug("Nothing to delete; no practitioners in database");
    return;
  }
  if (practitionerId) {
    await deleteAndCascadeDelete([practitionerId]);
  } else {
    const practitionerIds = practitionerData.entry?.map((entry) => entry.resource?.id) as string[];
    await deleteAndCascadeDelete(practitionerIds);
  }
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
