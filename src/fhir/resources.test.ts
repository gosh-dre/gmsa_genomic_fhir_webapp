import { Fhir } from "fhir/fhir";
import { SampleSchema } from "../components/reports/formDataValidation";
import { serviceRequestAndId } from "./resources";

const fhir = new Fhir();

/**
 * For testing during development, allows testing of individual resources
 * Using this to test resources which have a lot of dependent references that aren't yet created
 */
describe("FHIR resource for development", () => {
  test("ServiceRequest", () => {
    const form: SampleSchema = {
      specimenCode: "19RG-183G0127",
      specimenType: "122555007",
      receivedDateTime: "04/06/2019",
      collectionDateTime: "04/06/2019",
      reasonForTestCode: "230387008",
      reasonForTestText:
        "Sequence variant screening in Donald Duck because of epilepsy and atypical absences. " +
        "An SLC2A1 variant is suspected.",
    };

    const resource = serviceRequestAndId(form, "patientId", "planId", "practitionerId", "specimenId");

    const output = fhir.validate(resource.resource);
    console.info("Validation output");
    console.info(JSON.stringify(output.messages));
    expect(output.valid).toBeTruthy();
  });
});
