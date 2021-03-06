import {
  Coding,
  Identifier,
  Narrative,
  Observation,
  ObservationComponent,
  Reference,
} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";

export const reference = (refType: string, id: string): Reference => {
  return { reference: `${refType}/${id}`, type: refType };
};

export const makeGoshAssigner = (valueType: string) => {
  return { use: Identifier.UseEnum.Official, assigner: { display: `GOSH ${valueType}` } };
};

export function generatedNarrative(...parts: string[]) {
  return { status: Narrative.StatusEnum.Generated, div: `${parts.join(" ")} from FHIR genomics app` };
}

/**
 * Create minimal patient observation for FHIR bundle.
 *
 * Used for both variant observations and overall interpretation
 * @param obsId Id for the observation
 * @param patientId patient Id
 * @param specimenId specimen Id
 * @param reporterId reporter Id
 * @param authoriserId authoriser Id
 * @param loincCode code in LOINC system
 * @param loincDisplay display in LOINC system
 */
export function createPatientObservation(
  obsId: string,
  patientId: string,
  specimenId: string,
  reporterId: string,
  authoriserId: string,
  loincCode: string,
  loincDisplay: string,
) {
  const obs = new Observation();
  obs.id = obsId;
  obs.resourceType = "Observation";
  obs.status = Observation.StatusEnum.Final;
  obs.code = {
    coding: [
      {
        system: "http://loinc.org",
        code: loincCode,
        display: loincDisplay,
      },
    ],
  };
  obs.subject = reference("Patient", patientId);
  obs.specimen = reference("Specimen", specimenId);
  obs.performer = [reference("Practitioner", reporterId), reference("Practitioner", authoriserId)];
  return obs;
}

export const observationComponent = (coding: Coding, value: Coding | string | boolean): ObservationComponent => {
  const component = new ObservationComponent();
  component.code = { coding: [coding] };
  if (value instanceof Coding) {
    component.valueCodeableConcept = { coding: [value] };
  } else if (typeof value == "boolean") {
    component.valueBoolean = value;
  } else {
    component.valueString = value;
  }
  return component;
};
