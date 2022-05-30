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
    const patientForm = {
      mrn: "969977",
      firstName: "Donald",
      lastName: "Duck",
      dateOfBirth: "2012-03-04",
      gender: Patient.GenderEnum.Male,
      familyNumber: "Z409929",
    };

    const orgForm = {
      name: "London North Genomic Laboratory Hub",
      streetAddress: [
        "Great Ormond Street Hospital for Children NHS Foundation Trust",
        "Levels 4-6 Barclay House",
        "37 Queen Square"],
      city: "London",
      country: "UK",
      postCode: "WC1N 3BH",
    }

    const bundle = createBundle(patientForm, orgForm);

    const output = fhir.validate(bundle);
    console.info("Validation output")
    console.info(JSON.stringify(output.messages))
    expect(output.valid).toBeTruthy();
  });
});
