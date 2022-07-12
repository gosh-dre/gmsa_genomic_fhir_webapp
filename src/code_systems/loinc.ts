import { ValueSet, ValueSetComposeIncludeConcept } from "fhir/r4";
import { Buffer } from "buffer";
import fetch from "node-fetch";

const USERNAME = process.env.REACT_APP_LOINC_USERNAME;
const PASSWORD = process.env.REACT_APP_LOINC_PASSWORD;
const AUTH = Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64");

const requestInit = {
  method: "GET",
  headers: {
    "Content-type": "application/json",
    _format: "json",
    Authorization: `Basic ${AUTH}`,
  },
};

export const zygosity = async (): Promise<ValueSet> => {
  return getValueSetData("LL381-5");
};

const getValueSetData = async (valueSet: string): Promise<ValueSet> => {
  const url = `https://fhir.loinc.org/ValueSet/${valueSet}`;
  const response = await fetch(url, requestInit);

  if (!response.ok) {
    throw new Error(`Failed to get loinc ${valueSet}`);
  }
  return await response.json();
};

export const getValues = (valueSet: ValueSet): ValueSetComposeIncludeConcept[] => {
  const unpacked = valueSet.compose?.include?.flatMap((c) => c.concept).filter(isConcept);
  if (unpacked === undefined) {
    return [];
  } else {
    return unpacked;
  }
};

const isConcept = (concept: ValueSetComposeIncludeConcept | undefined): concept is ValueSetComposeIncludeConcept => {
  return !!concept;
};
