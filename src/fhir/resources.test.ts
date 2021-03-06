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
      // will need codes here too - but probably best to load all possible codes and then query
      specimenType: "Venus blood specimen",
      receivedDateTime: new Date("2019-06-04"),
      collectionDateTime: new Date("2019-06-04"),
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
