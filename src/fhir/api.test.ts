import {createPatientEntry} from "./resources";
import {Patient} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/patient";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {Fhir} from "fhir";
import {createBundle} from "./api";

const fhir = new Fhir();


describe("FHIR resources", () => {
  /**
   * Given that form data has been correctly populated
   * When a FHIR bundle is created
   * Then the fhir library should pass validation of the bundle
   */
  test('Bundle is valid', () => {
    const formData = {
      mrn: "969977",
      firstName: "Donald",
      lastName: "Duck",
      dateOfBirth: "2012-03-04",
      gender: Patient.GenderEnum.Male,
      familyNumber: "Z409929",
    };

    const patient = createPatientEntry(formData);
    const bundle = createBundle(patient);

    const output = fhir.validate(bundle);
    console.info("Validation output")
    console.info(JSON.stringify(output.messages))
    expect(output.valid).toBeTruthy();
  });
});
