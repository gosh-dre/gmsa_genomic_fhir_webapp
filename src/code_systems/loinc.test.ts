/**
 * May mock out API later but useful for testing during development
 */

import { getSelectOptions, variantCodes } from "./loinc";
import { loincCodes } from "./loincCodes";

describe("LOINC", () => {
  /**
   * Given that the LOINC valuesets have been persisted to file
   * When the LOINC api is queried
   * Then the API results should be the same as the persisted data
   */
  test("Codes haven't changed", async () => {
    const valueSet = await variantCodes();

    expect(valueSet).toEqual(loincCodes);
  });

  /**
   * Given that persisted valueset for zygocity has 5 options including heteroplasmic
   * When select options are extracted
   * There should be 5 options, with one explicitly tested
   */
  test("Option values are returned from value set", async () => {
    const options = getSelectOptions(loincCodes.zygosity);

    expect(options.length).toEqual(5);
    expect(options).toContainEqual({ code: "LA6703-8", display: "Heteroplasmic" });
  });
});
