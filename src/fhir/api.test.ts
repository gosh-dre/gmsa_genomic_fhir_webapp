import { Fhir } from "fhir/fhir";
import { createBundle } from "./api";
import { initialValues, initialWithNoVariant } from "../components/reports/FormDefaults";
import { Observation } from "fhir/r4";
import { geneCoding } from "../code_systems/hgnc";
import { Bundle } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/bundle";

const fhir = new Fhir();

const reportedGenes = [geneCoding("HGNC:4389", "GNA01")];
const FHIR_URL = process.env.REACT_APP_FHIR_URL || "";

const check = async (response: Response) => {
  const r = await response.json();
  if (!response.ok) {
    console.error(r.body);
    throw new Error(response.statusText);
  }
  return r;
};

const getPatients = async (identifier?: string) => {
  const url = `${FHIR_URL}/Patient`;
  //trim down with url variable in if
  let response;
  if (identifier) {
    response = await fetch(`${url}?identifier=${identifier}`);
  } else response = await fetch(url);
  return await check(response);
};

const sendBundle = async (bundle: Bundle) => {
  return await fetch(`${FHIR_URL}/`, {
    method: "POST",
    body: JSON.stringify(bundle),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/**
 * Given an ID string
 * this will delete the chosen patient's records, otherwise it will remove all patients by looping
 * through and extracting IDs from the search bundle
 */
const deletePatients = async (patientId?: string) => {
  const patientData = await getPatients();
  if (!("entry" in patientData)) {
    return;
  }
  if (patientId) {
    await deleteRequest(patientId);
    console.info("deleting records related to " + patientId);
  } else deleteAllPatients();

  await new Promise((r) => setTimeout(r, 1500));
};

const deleteRequest = async (id: string) => {
  const baseURL = `${FHIR_URL}/Patient`;
  const response = await fetch(`${baseURL}/${id}?_cascade=delete`, {
    method: "DELETE",
  });
  check(response);
};

// could update this to accept a bundle?
const deleteAllPatients = async () => {
  const patientData = await getPatients();

  for (const entry in patientData.entry) {
    const patient = patientData.entry[entry];
    const id = patient.resource.id;
    await deleteRequest(id);
  }
};

describe("FHIR resources", () => {
  beforeEach(async () => {
    // console.log("before each");
    fetchMock.dontMock();
    await deletePatients();
  });

  /**
   * Before doing tests on the database, we want to clear all its data
   */
  test("database is clear on setup", async () => {
    const postDelete = await getPatients();
    console.log("post delete", postDelete);
    if (postDelete["entry"]) {
      console.error(postDelete["entry"]);
    }
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
    check(createPatient);
    const patientData = await getPatients();
    expect("entry" in patientData).toBeTruthy();
    expect(patientData.entry[0].resource.identifier[0].value).toEqual(initialValues.patient.mrn);
  });

  /**
   * Given that form data has been correctly populated
   * When a FHIR bundle is created
   * Then the fhir library should pass validation of the bundle
   */
  test("Bundle with variants is valid", () => {
    const bundle = createBundle(initialValues, reportedGenes);

    const output = fhir.validate(bundle);
    console.info("Validation output");
    console.info(JSON.stringify(output.messages, null, 2));
    expect(output.valid).toBeTruthy();
  });

  /**
   * Given that form data has been populated with no variants
   * When a FHIR bundle is created
   * Then the fhir library should pass validation of the bundle and null variant entry
   */
  test("Bundle without variants", () => {
    const bundle = createBundle(initialWithNoVariant, []);

    // null variant entry
    const variantNotes = bundle.entry
      .filter((entry) => entry.resource.resourceType === "Observation")
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
    expect(originalPatient.entry[0].resource.identifier[0].value).toEqual(
      updatedPatient.entry[0].resource.identifier[0].value,
    );
    expect(originalPatient.entry[0].resource.identifier[0].value).toEqual(initialValues.patient.mrn);
    // check that the new value is in the updated entry
    expect(updatedPatient.entry[0].resource.name[0].given).toEqual(["Daffy"]);
    // double check the two entries are different
    expect(updatedPatient.entry[0].resource.name[0].given).not.toEqual(originalPatient.entry[0].resource.name[0].given);
  });
  test.skip("Checking only variant is different", async () => {
    const variantBundle = createBundle(initialValues, reportedGenes);
    const noVariantBundle = createBundle(initialWithNoVariant, []);

    const createVariantPatient = await fetch(`${FHIR_URL}/`, {
      method: "POST",
      body: JSON.stringify(variantBundle),
      headers: {
        "Content-Type": "application/json",
      },
    });
    check(createVariantPatient);
    const variantPatientData = await getPatients();
    console.log("vp only", variantPatientData);

    const createPlainPatient = await fetch(`${FHIR_URL}/`, {
      method: "POST",
      body: JSON.stringify(noVariantBundle),
      headers: {
        "Content-Type": "application/json",
      },
    });
    check(createPlainPatient);
    const plainPatientData = await getPatients();
    console.log("vp:", variantPatientData, "pp", plainPatientData);
    // ideally there's a way to do all equal except x

    expect(variantPatientData.entry[0].resource.identifier.value).toEqual(
      plainPatientData.entry[0].resource.identifier.value,
    );
  });
});
