import { Bundle } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/bundle";
import { getErrors } from "./api";
import { FhirContext } from "../components/fhir/FhirContext";
import ReportForm from "../components/reports/ReportForm";
import { noValues } from "../components/reports/FormDefaults";
import FHIR from "fhirclient/lib/entry/browser";
import React from "react";

/**
 * Utilities to be used only during testing, no actual tests here.
 */

const FHIR_URL = process.env.REACT_APP_FHIR_URL || "";

export const createPractitioner = async (practitioner: any) => {
  const sendPractitioner = await fetch(`${FHIR_URL}/Practitioner`, {
    method: "POST",
    body: JSON.stringify(practitioner),
    headers: {
      "Content-Type": "application/json",
    },
  });
  await new Promise((r) => setTimeout(r, 500));
  return checkResponseOK(sendPractitioner);
};

export const sendBundle = async (bundle: Bundle) => {
  const sentBundle = await fetch(`${FHIR_URL}/`, {
    method: "POST",
    body: JSON.stringify(bundle),
    headers: {
      "Content-Type": "application/json",
    },
  });
  await new Promise((r) => setTimeout(r, 500));
  return checkResponseOK(sentBundle);
};

const checkResponseOK = async (response: Response) => {
  const r = await response.json();
  if (!response.ok) {
    console.error(JSON.stringify(r));
    throw new Error(response.statusText);
  }
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
      console.debug(`No ${r} to delete`);
      continue;
    }
    if (id) {
      await deleteAndCascadeDelete([id], r as string);
    } else {
      const resourceId = fhirData.entry?.map((entry) => entry.resource?.id) as string[];
      await deleteAndCascadeDelete(resourceId, r as string);
    }
  }
};

const deleteAndCascadeDelete = async (identifiers: string[], resource: string) => {
  console.debug(`deleting ${identifiers.length}x ids of resource '${resource}'`);
  for (const id of identifiers) {
    const response = await fetch(`${FHIR_URL}/${resource}/${id}?_cascade=delete`, {
      method: "DELETE",
    });
    await checkResponseOK(response);
    await new Promise((r) => setTimeout(r, 500));
  }
};

/**
 * Report Form setup for testing of the modal output.
 *
 * Contains hooks for displaying the modal and the fhir client context being set.
 * @constructor
 */
export const TestReportForm: React.FC = () => {
  const client = FHIR.client(FHIR_URL);

  return (
    <>
      <div id="backdrop-hook"></div>
      <div id="modal-hook"></div>
      <div id="root"></div>
      <FhirContext.Provider value={{ client: client, setClient: () => "" }}>
        <ReportForm initialValues={noValues} />
      </FhirContext.Provider>
    </>
  );
};
