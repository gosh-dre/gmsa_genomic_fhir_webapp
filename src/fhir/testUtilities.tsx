import { Bundle } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/bundle";
import { getErrors } from "./api";
import { FhirContext } from "../components/fhir/FhirContext";
import ReportForm from "../components/reports/ReportForm";
import { noValues } from "../components/reports/FormDefaults";
import FHIR from "fhirclient/lib/entry/browser";
import React from "react";
import { RetrievableResource } from "../code_systems/types";
import { Practitioner } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/practitioner";
import ResultsDataFetcher from "../components/results-list/ResultsDataFetcher";

/**
 * Utilities to be used only during testing, no actual tests here.
 */

const FHIR_URL = process.env.REACT_APP_FHIR_URL || "";

export const createPractitioner = async (practitioner: Practitioner) => {
  const sendPractitioner = await fetch(`${FHIR_URL}/Practitioner`, {
    method: "POST",
    body: JSON.stringify(practitioner),
    headers: {
      "Content-Type": "application/json",
    },
  });
  // await new Promise((r) => setTimeout(r, 500));
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
  // await new Promise((r) => setTimeout(r, 500));
  return checkResponseOK(sentBundle);
};

const checkResponseOK = async (response: Response) => {
  const jsonData = await response.json();
  if (!response.ok) {
    console.error(JSON.stringify(jsonData));
    throw new Error(response.statusText);
  }
  if (!(jsonData.type === "bundle-response")) {
    return jsonData;
  }
  const errors = getErrors(jsonData);
  if (errors.length > 1) {
    errors.forEach((error) => {
      const message = error.diagnostics;
      throw new Error(message);
    });
  }
  console.debug(`check response: ${JSON.stringify(jsonData, null, 2)}`);
  return jsonData;
};

export const getResources = async (
  resource: "Practitioner" | "Patient" | "Observation",
  id?: string,
): Promise<Bundle> => {
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

export const deleteFhirData = async (resource?: RetrievableResource, id?: string) => {
  let resources = [resource];

  if (!resource) {
    resources = ["Patient", "Practitioner"];
  }
  for (const resourceToDelete of resources) {
    const fhirData = await getResources(resourceToDelete as RetrievableResource);
    if (!("entry" in fhirData)) {
      console.debug(`No ${resourceToDelete} to delete`);
      continue;
    }
    if (id) {
      await deleteAndCascadeDelete([id], resourceToDelete as RetrievableResource);
    } else {
      const resourceId = fhirData.entry?.map((entry) => entry.resource?.id) as string[];
      await deleteAndCascadeDelete(resourceId, resourceToDelete as RetrievableResource);
    }
  }
};

const deleteAndCascadeDelete = async (identifiers: string[], resource: RetrievableResource) => {
  console.debug(`deleting ${identifiers.length}x ids of resource '${resource}'`);
  for (const id of identifiers) {
    const response = await fetch(`${FHIR_URL}/${resource}/${id}?_cascade=delete`, {
      method: "DELETE",
    });
    await checkResponseOK(response);
    // await new Promise((r) => setTimeout(r, 500));
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

export const TestResultsDataFetcher: React.FC = () => {
  const client = FHIR.client(FHIR_URL);

  return (
    <>
      <div id="backdrop-hook"></div>
      <div id="modal-hook"></div>
      <div id="root"></div>
      <FhirContext.Provider value={{ client: client, setClient: () => "" }}>
        <ResultsDataFetcher />
      </FhirContext.Provider>
    </>
  );
};
