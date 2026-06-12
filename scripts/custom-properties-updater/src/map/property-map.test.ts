import { describe, expect, test } from "vitest";
import { PropertyMapper } from "./property-map.ts";

describe("ProductionAssetsPropertyMap", () => {
  describe("toCsv", () => {
    test("creates a csv for production assets", () => {
      const data = [
        {
          repository: "govuk-one-login/test1",
          oldValue: "one",
          newValue: "",
        },
        {
          repository: "govuk-one-login/test2",
          oldValue: "two",
          newValue: "four",
        },
        {
          repository: "govuk-one-login/test3",
          oldValue: "three",
          newValue: "",
        },
      ];
      const propertyMap = new PropertyMapper("production-assets", data);
      const csv = propertyMap.toCsv();

      const expectedCsv =
        "repository,production-assets,newValue\n" +
        "govuk-one-login/test1,one,\n" +
        "govuk-one-login/test2,two,four\n" +
        "govuk-one-login/test3,three,\n";

      expect(csv).toBe(expectedCsv);
    });
  });

  describe("fromCsv", () => {
    test("creates a csv for pod", () => {
      const csv =
        "repository,pod,newValue\n" +
        "govuk-one-login/test1,one,\n" +
        "govuk-one-login/test2,two,four\n" +
        "govuk-one-login/test3,three,\n";

      const productionAssetsMap = PropertyMapper.fromCsv(csv);

      const expectedData = [
        {
          repository: "govuk-one-login/test1",
          oldValue: "one",
          newValue: "",
        },
        {
          repository: "govuk-one-login/test2",
          oldValue: "two",
          newValue: "four",
        },
        {
          repository: "govuk-one-login/test3",
          oldValue: "three",
          newValue: "",
        },
      ];
      expect(productionAssetsMap.data).toStrictEqual(expectedData);
    });
  });

  describe("getChanges", () => {
    test("can pull out a list of only things that are changing", () => {
      const data = [
        {
          repository: "govuk-one-login/test1",
          oldValue: "one",
          newValue: "",
        },
        {
          repository: "govuk-one-login/test2",
          oldValue: "two",
          newValue: "four",
        },
        {
          repository: "govuk-one-login/test3",
          oldValue: "three",
          newValue: "",
        },
      ];
      const productionAssetsMap = new PropertyMapper("team-responsible", data);

      const expectedChanges = [
        {
          repository: "govuk-one-login/test2",
          oldValue: "two",
          newValue: "four",
        },
      ];

      expect(productionAssetsMap.getChanges()).toStrictEqual(expectedChanges);
    });
  });

  describe("it detects errors", () => {
    const knownGood = {
      repository: "some/repository",
      oldValue: "one",
      newValue: "two",
    };

    const knownGoodCsv =
      "repository,customProperty,newValue\nsome/repository,one,two";

    test("it's ok with a known good value", () => {
      const testData = { ...knownGood };
      expect(
        () => new PropertyMapper("customProperty", [testData]),
      ).not.toThrow();

      const testCsv = `${knownGoodCsv}`;
      expect(() => PropertyMapper.fromCsv(testCsv)).not.toThrow();
    });

    test("it knows when repository is missing", () => {
      const testCsv = "customProperty,newValue\none,two";
      expect(() => PropertyMapper.fromCsv(testCsv)).toThrow(
        /must contain.*repository/,
      );
    });

    test("it knows when newValue is missing", () => {
      const testCsv = "repository,customProperty\nsome/repository,one";
      expect(() => PropertyMapper.fromCsv(testCsv)).toThrow(
        /must contain.*newValue/,
      );
    });

    test("it knows when initial value is missing", () => {
      const testCsv = "repository,newValue\nsome/repository,two";
      expect(() => PropertyMapper.fromCsv(testCsv)).toThrow(
        /must contain.*other field/,
      );
    });

    test("it knows when there are too many fields", () => {
      const testCsv =
        "repository,customProperty,newValue,extraField\nsome/repository,one,two,err";
      expect(() => PropertyMapper.fromCsv(testCsv)).toThrow(
        /must contain.*exactly/,
      );
    });

    test("it prevents csv's with no data", () => {
      const testCsv = "repository,oldValue,newValue,extraField";
      expect(() => PropertyMapper.fromCsv(testCsv)).toThrow(/no data/i);
    });
  });
});
