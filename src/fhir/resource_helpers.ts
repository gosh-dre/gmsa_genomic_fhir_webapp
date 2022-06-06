import {
  Coding,
  Identifier,
  Narrative,
  ObservationComponent,
  Reference
} from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";

export const reference = (refType: string, id: string): Reference => {
  return {reference: `${refType}/${id}`, type: refType}
};

export const makeGoshAssigner = (valueType: string) => {
  return {use: Identifier.UseEnum.Official, assigner: {display: `GOSH ${valueType}`}}
}

export function generatedNarrative(...parts: string[]) {
  return {status: Narrative.StatusEnum.Generated, div: `${parts.join(" ")} from FHIR genomics app`};
}


export const observationComponent = (coding: Coding, value: Coding | string | boolean): ObservationComponent => {
  const component = new ObservationComponent();
  component.code = {coding: [coding]};
  if (value instanceof Coding) {
    component.valueCodeableConcept = {coding: [value]}
  } else if (typeof value == "boolean") {
    component.valueBoolean = value;
  } else {
    component.valueString = value;
  }
  return component;
};
