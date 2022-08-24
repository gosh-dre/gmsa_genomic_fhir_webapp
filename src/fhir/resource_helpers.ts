import {
  Coding,
  Identifier,
  Narrative,
  Observation,
  ObservationComponent,
  Reference,
} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";
import { Uri } from "@smile-cdr/fhirts/src/FHIR-R4/classes/uri";

export const reference = (refType: string, identifierQuery: string): Reference => {
  return { reference: `${refType}?identifier=${identifierQuery}`, type: refType };
};

type SystemIdentifier = { value: string; system: Uri };

export const makeGoshAssigner = (valueType: string) => {
  return { use: Identifier.UseEnum.Official, assigner: { display: `GOSH ${valueType}` } };
};

export const goshIdentifier = (value: string, otherFields?: Identifier) => {
  let usedFields: Identifier = {};

  if (otherFields) {
    usedFields = otherFields;
  }
  return identifier(value, "https://www.gosh.nhs.uk", usedFields);
};

/**
 * Create identifier with a system and any other fields
 *
 * Needs to strip out anything with a "|" from the value because this can happen when you're specifying an
 * identifier system in a query
 * @param value identifier value, if it has a "|" character then anything before this will be removed
 * @param system identifier system
 * @param otherFields other fields to add to the identifier
 */
export const identifier = (value: string, system: Uri, otherFields: Identifier) => {
  const systemStripped = value.replace(/.*\|/, "");

  return { ...otherFields, value: systemStripped, system: system };
};

export const getSystemIdentifier = (systemId: SystemIdentifier) => {
  return `${systemId.system}|${systemId.value}`;
};

export function generatedNarrative(...parts: string[]) {
  return {
    status: Narrative.StatusEnum.Generated,
    div: `<div xmlns=\\"http://www.w3.org/1999/xhtml\\">${parts.join(" ")} from FHIR genomics app</div>`,
  };
}

/**
 * Create minimal patient observation for FHIR bundle.
 *
 * Used for both variant observations and overall interpretation
 * @param obsId Id for the observation
 * @param patientQuery to link the resource with
 * @param specimenQuery to link the resource with
 * @param reporterQuery to link the resource with
 * @param authoriserQuery to link the resource with
 * @param loincCode code in LOINC system
 * @param loincDisplay display in LOINC system
 */
export function createPatientObservation(
  obsId: string,
  patientQuery: string,
  specimenQuery: string,
  reporterQuery: string,
  authoriserQuery: string,
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
  obs.subject = reference("Patient", patientQuery);
  obs.specimen = reference("Specimen", specimenQuery);
  obs.performer = [reference("Practitioner", reporterQuery), reference("Practitioner", authoriserQuery)];
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
