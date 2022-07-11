/**
 * required to allow for tests to run against API.
 * May mock out API later but useful for testing during development
 * @jest-environment node
 */

import { getValues, zygosity } from "./loinc";

describe("LOINC", () => {
  test("Zygosity", async () => {
    const valueSet = await zygosity();

    const values = getValues(valueSet);

    expect(valueSet.resourceType).toEqual("ValueSet");
    expect(values.length).toEqual(5);
    expect(values).toContainEqual({ code: "LA6703-8", display: "Heteroplasmic" });
  });
});
