import { Fhir } from "fhir/fhir";
import { createBundle } from "./api";
import { initialValues, initialWithNoVariant } from "../components/reports/FormDefaults";
import { Observation } from "fhir/r4";
import { geneCoding } from "../code_systems/hgnc";

const fhir = new Fhir();

const reportedGenes = [geneCoding("HGNC:4389", "GNA01")];
const FHIR_URL = process.env.REACT_APP_FHIR_URL;

describe("FHIR resources", () => {
  test("fhir setup empty", async () => {
    // Check that the api has no data in it before bundles are created
    // i.e before a user inputs data - check database has nothing in it

    const response = await fetch(`${FHIR_URL}/Patient`);
    if (!response.ok) {
      console.error(response.status);
    }
    const data = await response.json();
    expect(data).toEqual([0, [], null, []]);
  });

  test("bundle creates patient", async () => {
    const bundle = createBundle(initialValues, reportedGenes);
    console.log(JSON.stringify(bundle.entry[0]));
    const createPatient = await fetch(`${FHIR_URL}/`, {
      method: "POST",
      body: JSON.stringify(bundle),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!createPatient.ok) {
      console.error(createPatient.body);
    }
    const postData = await createPatient.json();
    console.log(postData);

    const response = await fetch(`${FHIR_URL}/Patient`);
    if (!response.ok) {
      console.error(response.status);
    }
    const data = response.body;
    expect(data).not.toEqual([0, [], null, []]);
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
    console.info(JSON.stringify(output.messages, null, 2));
    expect(output.valid).toBeTruthy();
  });
});
