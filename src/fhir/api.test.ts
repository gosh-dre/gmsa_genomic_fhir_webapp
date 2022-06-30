import { Fhir } from "fhir/fhir";
import { createBundle } from "./api";
import { initialValues } from "../components/reports/FormDefaults";

const fhir = new Fhir();

describe("FHIR resources", () => {
  /**
   * Given that form data has been correctly populated
   * When a FHIR bundle is created
   * Then the fhir library should pass validation of the bundle
   */
  test("Bundle is valid", () => {
    const bundle = createBundle(initialValues);

    const output = fhir.validate(bundle);
    console.info("Validation output");
    console.info(JSON.stringify(output.messages, null, 2));
    expect(output.valid).toBeTruthy();
  });
});
