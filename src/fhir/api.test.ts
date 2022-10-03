import { Fhir } from "fhir/fhir";
import { createBundle } from "./api";
import { initialValues, initialWithNoVariant } from "../components/reports/FormDefaults";
import { Observation } from "fhir/r4";
import { geneCoding } from "../code_systems/hgnc";

const fhir = new Fhir();

const reportedGenes = [geneCoding("HGNC:4389", "GNA01")];
const FHIR_URL = process.env.REACT_APP_FHIR_URL || "";

const getPatients = async () => {
  const url = `${FHIR_URL}/Patient`;
  const response = await fetch(url);
  if (!response.ok) {
    console.error(response.statusText);
    console.error(response.body);
    throw new Error(response.statusText);
  }
  return await response.json();
};

describe("FHIR resources", () => {
  beforeEach(async () => {
    fetchMock.dontMock();
    const patientData = await getPatients();
    if (!("entry" in patientData)) {
      return;
    }
    // loop through all patients to delete; patientData with numerous entries
    const id = patientData.entry[0].resource.id;
    const response = await fetch(`${FHIR_URL}/Patient/${id}?_cascade=delete`, {
      method: "DELETE",
    });
    if (!response.ok) {
      console.log(response.statusText);
      console.log(response.body);
    }
    const check = await response.json();
    console.log(check);
    await new Promise((r) => setTimeout(r, 500));
  });

  test("clear database on setup", async () => {
    /**
     * Before doing tests on the database, we want to clear all its data
     */

    const postDelete = await getPatients();
    expect("entry" in postDelete).toBeFalsy();
  });

  test("bundle creates patient", async () => {
    const bundle = createBundle(initialValues, reportedGenes);

    const createPatient = await fetch(`${FHIR_URL}/`, {
      method: "POST",
      body: JSON.stringify(bundle),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!createPatient.ok) console.error(createPatient.body);
    const check = await createPatient.json();
    console.log(check);
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
    // console.info(JSON.stringify(output.messages, null, 2));
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
      .filter((entry) => entry.resourceType === "Observation")
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
    // console.info(JSON.stringify(output.messages, null, 2));
    expect(output.valid).toBeTruthy();
  });
});
