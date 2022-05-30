import {Patient} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/patient";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {Fhir} from "fhir";
import {sampleSchema} from "../components/reports/formDataValidation";
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

    const sampleForm: typeof sampleSchema = {
      specimenCode: "19RG-183G0127",
      // will need codes here too - but probably best to load all possible codes and then query
      specimenType: "Venus blood specimen",
      collectionDate: "2019-06-04",
      reasonForTestCode: "230387008",
      reasonForTestText: "Sequence variant screening in Donald Duck because of epilepsy and atypical absences. " +
        "An SLC2A1 variant is suspected.",
    }

    const bundle = createBundle(patientForm, orgForm, sampleForm);

    const output = fhir.validate(bundle);
    console.info("Validation output")
    console.info(JSON.stringify(output.messages))
    expect(output.valid).toBeTruthy();
  });
});
