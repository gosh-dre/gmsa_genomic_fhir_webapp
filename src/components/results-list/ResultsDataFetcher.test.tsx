import { render, screen, waitFor } from "@testing-library/react";
import { initialValues } from "../reports/FormDefaults";
import { createBundle } from "../../fhir/api";
import { ContextAndModal, deleteFhirData, sendBundle } from "../../fhir/testUtilities";
import { geneCoding } from "../../code_systems/hgnc";
import ResultsDataFetcher from "./ResultsDataFetcher";

const reportedGenes = [geneCoding("HGNC:4389", "GNA01"), geneCoding("HGNC:6547", "LDLR")];

jest.setTimeout(20000);

type OverridingFields = {
  patient: {
    mrn: string;
    nhsNumber: string;
    firstName: string;
    lastName: string;
    familyNumber?: string;
  };
  sample: {
    specimenCode: string;
    reasonForTest: string[];
  };
  variant: {
    cDnaHgvs: string;
    gene: string;
    isPathogenic: boolean;
    transcript?: string;
  };
};

const clearFhirAndSendReports = async () => {
  await deleteFhirData();

  const overridingValues = [
    // not FH so shouldn't be in the list
    createPatientOverrides("Daffy", "Duck", ["R59"], "HGNC:4389", "c.140G>A"),
    // Has a family member who has been tests
    createPatientOverrides("Bugs", "Bunny", ["R134"], "HGNC:6547", "NM_000527.5:c.259T>G", "F12345"),
    createPatientOverrides("Betty", "Bunny", ["R134"], "HGNC:6547", "NM_000527.5:c.259T>G", "F12345"),
    // No family member who has been tested
    createPatientOverrides("Road", "Runner", ["R134"], "HGNC:6547", "NM_000527.5:c.27C>T", "F10000"),
    // No family member
    createPatientOverrides("Wile", "Coyote", ["R134"], "HGNC:6547", "NM_000527.5:c.58G>A"),
    // Benign
    createPatientOverrides("Yosemite", "Sam", ["R134"], "HGNC:6547", "NM_000527.5:c.9C>T", "F54321", false),
  ];

  for (const override of overridingValues) {
    const formData = changePatientInfo(override);
    const bundle = createBundle(formData, reportedGenes);
    await sendBundle(bundle);
  }
};

const createPatientOverrides = (
  firstName: string,
  lastName: string,
  testReason: string[],
  gene: string,
  cDnaHgvs: string,
  familyNumber?: string,
  isPathogenic = true,
): OverridingFields => {
  let transcript: string | undefined = undefined;
  if (cDnaHgvs.includes(":")) {
    transcript = cDnaHgvs.split(":")[0];
  }
  return {
    patient: {
      mrn: generateId("mrn"),
      nhsNumber: generateId("nhs"),
      firstName: firstName,
      lastName: lastName,
      familyNumber: familyNumber,
    },
    sample: { specimenCode: generateId("specimen"), reasonForTest: testReason },
    variant: {
      cDnaHgvs: cDnaHgvs,
      gene: gene,
      isPathogenic: isPathogenic,
      transcript: transcript,
    },
  };
};

const generateId = (type?: "nhs" | "specimen" | "mrn") => {
  let num;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomCharacter = characters[Math.floor(Math.random() * characters.length)];

  if (type === "nhs") {
    num = Math.floor(Math.random() * Math.pow(10, 10));
  } else if (type === "specimen") {
    num = randomCharacter + Math.floor(Math.random() * Math.pow(10, 10));
  } else if (type === "mrn") {
    num = Math.floor(Math.random() * Math.pow(10, 8));
  } else {
    throw new Error("Unrecognised generated type given");
  }
  return num.toString();
};

const changePatientInfo = (valuesToUpdate: OverridingFields) => {
  const newPatient = { ...initialValues };
  newPatient.patient.mrn = valuesToUpdate.patient.mrn;
  newPatient.patient.familyNumber = valuesToUpdate.patient.familyNumber;
  newPatient.patient.nhsNumber = valuesToUpdate.patient.nhsNumber;
  newPatient.patient.firstName = valuesToUpdate.patient.firstName;
  newPatient.patient.lastName = valuesToUpdate.patient.lastName;
  newPatient.sample.specimenCode = valuesToUpdate.sample.specimenCode;
  newPatient.sample.reasonForTest = valuesToUpdate.sample.reasonForTest;
  newPatient.variant[0].cDnaHgvs = valuesToUpdate.variant.cDnaHgvs;
  newPatient.variant[0].gene = valuesToUpdate.variant.gene;
  if (!valuesToUpdate.variant.isPathogenic) {
    newPatient.result.reportFinding = "LA6577-6"; // negative
    newPatient.variant[0].classification = "LA26334-5"; // likely benign
  }
  if (valuesToUpdate.variant.transcript) {
    newPatient.variant[0].transcript = valuesToUpdate.variant.transcript;
  }

  return newPatient;
};

describe("Results table", () => {
  beforeEach(() => {
    return clearFhirAndSendReports();
  });

  /**
   * Given the FHIR API is cleared and has 6 separate reports added with one variant each (one not FH)
   * When the Results list page is rendered
   * Then there should be 5 FH variants listed
   */
  test("patients are in table", async () => {
    render(<ContextAndModal children={<ResultsDataFetcher />} />);

    // Can put a breakpoint here to allow for development with 5 patients added to the result list
    await waitFor(
      () => {
        const resultsTable = screen.getAllByText(/NM_/);
        expect(resultsTable.length).toEqual(5);
      },
      { timeout: 15000 },
    );
  });
});
