import {
  Coding,
  Identifier,
  Narrative,
  Observation,
  ObservationComponent,
  Reference,
} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";

export const reference = (refType: string, identifier: string): Reference => {
  return { reference: `${refType}?identifier=${identifier}`, type: refType };
};

export const makeGoshAssigner = (valueType: string) => {
  return { use: Identifier.UseEnum.Official, assigner: { display: `GOSH ${valueType}` } };
};

/**
 * Create identifier with a value and any other fields
 *
 * @param value identifier value
 * @param otherFields other fields to add to the identifier
 */
export const createIdentifier = (value: string, otherFields?: Identifier) => {
  if (otherFields) {
    return { ...otherFields, value: value };
  }
  return { value: value };
};

export function generatedNarrative(...parts: string[]) {
  return {
    status: Narrative.StatusEnum.Generated,
    div: `<div xmlns="http://www.w3.org/1999/xhtml">${parts.join(" ")} from FHIR genomics app</div>`,
  };
}

/**
 * Create minimal patient observation for FHIR bundle.
 *
 * Used for both variant observations and overall interpretation
 * @param patientIdentifier to link the resource with
 * @param specimenIdentifier to link the resource with
 * @param reporterIdentifier to link the resource with
 * @param authoriserIdentifier to link the resource with
 * @param loincCode code in LOINC system
 * @param loincDisplay display in LOINC system
 */
export function createPatientObservation(
  patientIdentifier: string,
  specimenIdentifier: string,
  reporterIdentifier: string,
  authoriserIdentifier: string,
  loincCode: string,
  loincDisplay: string,
) {
  const obs = new Observation();
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
  obs.subject = reference("Patient", patientIdentifier);
  obs.specimen = reference("Specimen", specimenIdentifier);
  obs.performer = [reference("Practitioner", reporterIdentifier), reference("Practitioner", authoriserIdentifier)];
  return obs;
}

export const observationComponent = (coding: Coding, value: Coding | string | boolean): ObservationComponent => {
  const component = new ObservationComponent();
  component.code = { coding: [coding] };
  if (typeof value === "string") {
    component.valueString = value;
  } else if (typeof value === "boolean") {
    component.valueBoolean = value;
  } else {
    component.valueCodeableConcept = { coding: [value] };
  }
  return component;
};
