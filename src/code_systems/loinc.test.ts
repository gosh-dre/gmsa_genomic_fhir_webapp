/**
 * May mock out API later but useful for testing during development
 */

import { getValues, variantCodes } from "./loinc";

describe("LOINC", () => {
  test("Zygosity", async () => {
    const valueSet = await variantCodes();

    const values = getValues(valueSet.zygosity);

    expect(valueSet.zygosity.resourceType).toEqual("ValueSet");
    expect(values.length).toEqual(5);
    expect(values).toContainEqual({ code: "LA6703-8", display: "Heteroplasmic" });
  });
});
