import { Fhir } from "fhir/fhir";
import { BundleResponse } from "../code_systems/types";
import { createBundle } from "./api";
import { initialValues, initialWithNoVariant } from "../components/reports/FormDefaults";
import { Observation } from "fhir/r4";
import { geneCoding } from "../code_systems/hgnc";
import { Bundle } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/bundle";
import { BundleEntry } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/bundleEntry";
import { Patient } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";

const fhir = new Fhir();

const reportedGenes = [geneCoding("HGNC:4389", "GNA01")];
const FHIR_URL = process.env.REACT_APP_FHIR_URL || "";

const checkResponseOK = async (response: Response) => {
  const r = await response.json();

  if (!response.ok) {
    console.error(r.body);
    throw new Error(response.statusText);
  }
  if (!(r.type === "bundle-response")) {
    return r;
  }

  const errors = (r as BundleResponse).entry
    .filter((entry) => entry.response.status.toString().startsWith("4"))
    .map((entry) => entry.response.outcome.issue);

  if (errors.length > 1) {
    errors.forEach((issue) => {
      let message = "unknown error in bundle";
      if (issue && issue.length > 0) {
        message = issue[0].diagnostics;
      }
      throw new Error(message);
    });
  }

  console.debug(`check response: ${JSON.stringify(r, null, 2)}`);
  return r;
};

const getPatients = async (identifier?: string): Promise<Bundle> => {
  let url = `${FHIR_URL}/Patient`;
  if (identifier) url = `${FHIR_URL}/Patient?identifier=${identifier}`;
  const response = await fetch(url);
  return await checkResponseOK(response);
};

const getObservations = async (identifier?: string): Promise<Bundle> => {
  let url = `${FHIR_URL}/Observation`;
  if (identifier) url = `${FHIR_URL}/Observation?identifier=${identifier}`;
  const response = await fetch(url);
  return await checkResponseOK(response);
};

const sendBundle = async (bundle: Bundle) => {
  const sentBundle = await fetch(`${FHIR_URL}/`, {
    method: "POST",
    body: JSON.stringify(bundle),
    headers: {
      "Content-Type": "application/json",
    },
  });
  // await new Promise((r) => setTimeout(r, 1500));
  return sentBundle;
};

/**
 * Given an ID string
 * this will delete the chosen patient's records, otherwise it will remove all patients by looping
 * through and extracting IDs from the search bundle
 */
const deletePatients = async (patientId?: string) => {
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

// jest.setTimeout(20000);

const getPatientIdentifier = (patientData: Bundle) => {
  const patientResource = getPatientResource(patientData);
  return patientResource.identifier?.at(0)?.value;
};

const getPatientResource = (patientData: Bundle) => {
  return patientData.entry
    ?.map((entry) => entry.resource)
    .filter((resource) => resource?.resourceType === "Patient")
    .pop() as Patient;
};

const getPatientGivenNames = (patientData: Bundle) => {
  const patientResource = getPatientResource(patientData);
  return patientResource.name?.at(0)?.given;
};

describe("FHIR resources", () => {
  beforeEach(async () => {
    fetchMock.dontMock();
    await deletePatients();
  });

  /**
   * Before doing tests on the database, we want to clear all its data
   */
  test("database is clear on setup", async () => {
    const postDelete = await getPatients();
    expect("entry" in postDelete).toBeFalsy();
  });

  /**
   * Given no patients exist in the FHIR API
   * When a report bundle is sent to the FHIR API
   * Then there should be one entry in the FHIR API, and the identifier should be the MRN from the bundle
   */
  test("bundle creates patient", async () => {
    const bundle = createBundle(initialValues, reportedGenes);

    const createPatient = await sendBundle(bundle);

    // check it's the right patient
    await checkResponseOK(createPatient);
    const patientData = await getPatients();
    expect("entry" in patientData).toBeTruthy();
    expect(getPatientIdentifier(patientData)).toEqual(initialValues.patient.mrn);
  });

  /**
   * Given that form data has been correctly populated
   * When a FHIR bundle is created
   * Then the fhir library should pass validation of the bundle and have the expected profile
   */
  test("Bundle with variants is valid", async () => {
    const bundle = createBundle(initialValues, reportedGenes);

    const output = fhir.validate(bundle);
    console.info("Validation output");
    console.info(JSON.stringify(output.messages, null, 2));
    expect(output.valid).toBeTruthy();

    // check it has the expected profile
    await sendBundle(bundle);
    const expectedProfile = "http://hl7.org/fhir/uv/genomics-reporting/StructureDefinition/variant";

    const obsResponse = await getObservations();
    // filter by expectedProfile and count length?
    const varProfile = (obsResponse.entry as Array<BundleEntry>)
      .filter((entry) => entry.resource?.resourceType === "Observation")
      .map((entry) => entry.resource as Observation)
      .filter((obs) => obs.meta?.profile?.includes(expectedProfile));
    expect(varProfile.length).toEqual(1);
  });

  /**
   * Given that form data has been populated with no variants
   * When a FHIR bundle is created
   * Then the fhir library should pass validation of the bundle and null variant entry
   */
  test("Bundle without variants", async () => {
    const bundle = createBundle(initialWithNoVariant, []);
    await sendBundle(bundle);
    const obsResponse = await getObservations();

    // null variant entry
    const variantNotes = (obsResponse.entry as Array<BundleEntry>)
      .filter((entry) => entry.resource?.resourceType === "Observation")
      .map((entry) => entry.resource as Observation)
      .filter((obs) =>
        obs.meta?.profile?.includes("http://hl7.org/fhir/uv/genomics-reporting/StructureDefinition/Variant"),
      )
      .map((obs) => obs.note)
      .flat();

    expect(variantNotes).toEqual([{ text: "No variants reported" }]);

    // fhir validation
    const output = fhir.validate(bundle);
    console.info("Validation output");
    console.info(JSON.stringify(output.messages, null, 2));
    expect(output.valid).toBeTruthy();
  });
  /**
   * Given that a patient has been created
   * When their details are updated
   * Then the updated values should persist
   */
  test("Information can be updated", async () => {
    const identifier = initialValues.patient.mrn;
    const originalBundle = createBundle(initialValues, reportedGenes);

    await sendBundle(originalBundle);
    const originalPatient = await getPatients(identifier);

    const newValues = { ...initialValues };
    newValues.patient.firstName = "Daffy";
    const updatedBundle = createBundle(newValues, reportedGenes);

    await sendBundle(updatedBundle);
    const updatedPatient = await getPatients(identifier);
    // check it's the right patient by identifier
    expect(getPatientIdentifier(originalPatient)).toEqual(getPatientIdentifier(updatedPatient));
    expect(getPatientIdentifier(originalPatient)).toEqual(initialValues.patient.mrn);
    // check that the new value is in the updated entry
    expect(getPatientGivenNames(updatedPatient)).toEqual(["Daffy"]);
    // check the two entries are different
    expect(getPatientGivenNames(updatedPatient)).not.toEqual(getPatientGivenNames(originalPatient));
  });
});
