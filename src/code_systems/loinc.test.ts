/**
 * May mock out API later but useful for testing during development
 */
import "jest-fetch-mock";

import { getSelectOptions, variantCodes } from "./loinc";
import { loincCodes, loincSelect } from "./loincCodes";

describe("LOINC", () => {
  beforeEach(() => {
    fetchMock.dontMock();
  });
  /**
   * Given that the LOINC select options have been created from static file
   * When the LOINC api is queried and converted to select options
   * Then the results should be the same
   */
  test("Codes haven't changed", async () => {
    const valueSet = await variantCodes();
    const selectValues = {
      classification: getSelectOptions(valueSet.classification),
      inheritance: getSelectOptions(valueSet.inheritance),
      zygosity: getSelectOptions(valueSet.zygosity),
      reportFinding: getSelectOptions(valueSet.reportFinding),
      followUp: getSelectOptions(valueSet.followUp),
    };

    expect(selectValues).toEqual(loincSelect);
  });

  /**
   * Given that persisted valueset for zygocity has 5 options including heteroplasmic
   * When select options are extracted
   * There should be 5 options, with one explicitly tested
   */
  test("Option values are returned from value set", async () => {
    const options = getSelectOptions(loincCodes.zygosity);

    expect(options.length).toEqual(5);
    expect(options).toContainEqual({ code: "LA6703-8", display: "Heteroplasmic", system: "http://loinc.org" });
  });
});
