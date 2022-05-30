import { Identifier, Narrative, Reference } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";

export const reference = (refType: string, id: string): Reference => {
  return {reference: `${refType}/${id}`, type: refType}
};

export const makeGoshAssigner = (valueType: string) => {
  return {use: Identifier.UseEnum.Official, assigner: {display: `GOSH ${valueType}`}}
}

export function generatedNarrative(...parts: string[]) {
  return {status: Narrative.StatusEnum.Generated, div: `${parts.join(" ")} from FHIR genomics app`};
}
