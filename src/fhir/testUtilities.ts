import { Bundle } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/bundle";
import { getErrors } from "./api";

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

export const checkResponseOK = async (response: Response) => {
  const r = await response.json();

  if (!response.ok) {
    console.error(r.body);
    throw new Error(response.statusText);
  }
  //   if (r.type === "batch-response") {
  //     getErrors(r);
  //   } else
  if (!(r.type === "bundle-response")) {
    return r;
  }

  const errors = getErrors(r);
  if (errors.length > 1) {
    errors.forEach((error) => {
      const message = error.diagnostics;
      throw new Error(message);
    });
  }

  console.debug(`check response: ${JSON.stringify(r, null, 2)}`);
  return r;
};

export const getPatients = async (identifier?: string): Promise<Bundle> => {
  let url = `${FHIR_URL}/Patient`;
  if (identifier) url = `${FHIR_URL}/Patient?identifier=${identifier}`;
  const response = await fetch(url);
  return await checkResponseOK(response);
};

// const getPractitioners = async (id?: string): Promise<Bundle> => {
//   let url = `${FHIR_URL}/Practitioner`;
//   if (id) url = `${FHIR_URL}/Practitioner/${id}`;
//   const response = await fetch(url);
//   return await checkResponseOK(response);
// };

export const getResources = async (resource: string, id?: string): Promise<Bundle> => {
  let url = `${FHIR_URL}/${resource}`;
  if (id) {
    if (resource === "Practitioner") {
      url = `${FHIR_URL}/Practitioner/${id}`;
    }
    url = `${FHIR_URL}/${resource}?identifier=${id}`;
  }
  const response = await fetch(url);
  return await checkResponseOK(response);
};

export const deleteFhirData = async (resource?: string, id?: string) => {
  let resources = [resource];

  if (!resource) {
    resources = ["Patient", "Practitioner"];
  }
  for (const r of resources) {
    const fhirData = await getResources(r as string);
    if (!("entry" in fhirData)) {
      console.debug("Nothing to delete; no data in database");
      return;
    }
    if (id) {
      await deleteAndCascadeDelete([id], r as string);
    } else {
      const resourceId = fhirData.entry?.map((entry) => entry.resource?.id) as string[];
      await deleteAndCascadeDelete(resourceId, r as string);
    }
  }
  await new Promise((response) => setTimeout(response, 500));
};

export const deletePatients = async (patientId?: string) => {
  const patientData = await getPatients();
  if (!("entry" in patientData)) {
    console.debug("Nothing to delete; no patients in database");
    return;
  }
  if (patientId) {
    await deleteAndCascadeDelete([patientId], "Patient");
  } else {
    const patientIds = patientData.entry?.map((entry) => entry.resource?.id) as string[];
    await deleteAndCascadeDelete(patientIds, "Patient");
  }
  // await new Promise((r) => setTimeout(r, 1500));
};

export const deletePractitioners = async (practitionerId?: string) => {
  const practitionerData = await getPractitioners();
  if (!("entry" in practitionerData)) {
    console.debug("Nothing to delete; no practitioners in database");
    return;
  }
  if (practitionerId) {
    await deleteAndCascadeDelete([practitionerId], "Practitioner");
  } else {
    const practitionerIds = practitionerData.entry?.map((entry) => entry.resource?.id) as string[];
    await deleteAndCascadeDelete(practitionerIds, "Practitioner");
  }
};

const deleteAndCascadeDelete = async (identifiers: string[], resource: string) => {
  console.debug(`deleting ids: ${identifiers}`);
  for (const id of identifiers) {
    const response = await fetch(`${FHIR_URL}/${resource}/${id}?_cascade=delete`, {
      method: "DELETE",
    });
    await checkResponseOK(response);
  }
};
