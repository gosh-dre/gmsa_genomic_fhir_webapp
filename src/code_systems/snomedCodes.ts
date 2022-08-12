import { RequiredCoding } from "./types";

export const sampleTypes: RequiredCoding[] = [
  {
    system: "http://snomed.info/sct",
    code: "122555007",
    display: "Venous blood specimen",
  },
];

export const diseases: RequiredCoding[] = [
  {
    system: "http://snomed.info/sct",
    code: "230387008",
    display: "Benign occipital epilepsy of childhood - early onset variant",
  },
  {
    system: "http://snomed.info/sct",
    code: "5262007",
    display: "Spinal muscular atrophy",
  },
  {
    system: "http://snomed.info/sct",
    code: "73297009",
    display: "Muscular dystrophy",
  },
  {
    system: "http://snomed.info/sct",
    code: "190905008",
    display: "Cystic fibrosis",
  },
  {
    system: "http://snomed.info/sct",
    code: "398036000",
    display: "Familial hypercholesterolemia",
  },
  // top level SNOMED CT term for cancer
  {
    system: "http://snomed.info/sct",
    code: "363346000",
    display: "Malignant neoplastic disease",
  },
];
