import { describe, expect, test } from "vitest";
import { CustomProperty, isCustomProperty } from "./custom-property.ts";

describe("isCustomProperty", () => {
  test("accepts each custom property", () => {
    expect(isCustomProperty(CustomProperty.Pod)).toBe(true);
    expect(isCustomProperty(CustomProperty.TeamResponsible)).toBe(true);
    expect(isCustomProperty(CustomProperty.ProductionAssets)).toBe(true);
  });

  test("rejects anything else", () => {
    expect(isCustomProperty("else")).toBe(false);
  });
});
