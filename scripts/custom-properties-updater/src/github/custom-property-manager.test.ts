import { describe, expect, test } from "vitest";
import { CustomPropertyManager } from "./custom-property-manager.ts";
import { type GithubStubData, StubGithub } from "./github-stub.ts";
import { PropertyMapper } from "../map/property-map.ts";

describe("CustomPropertyManager", () => {
  const stubData: GithubStubData = [
    {
      organisation: "org1",
      repository: "repo1",
      customProperties: {
        customProp1: "old value 1",
        customProp2: "old value 2",
      },
    },
    {
      organisation: "org1",
      repository: "repo2",
      customProperties: {
        customProp1: "old value 3",
        customProp2: "old value 4",
        customProp3: "old value 5",
      },
    },
    {
      organisation: "org2",
      repository: "repo3",
      customProperties: {
        customProp1: "old value 6",
        customProp2: "old value 7",
      },
    },
  ];

  describe("getCustomProperty", () => {
    test("gets existing custom properties", async () => {
      const github = new StubGithub(stubData);
      const customPropertyManager = new CustomPropertyManager(github);

      const [errors, properties] = await customPropertyManager.getCustomProperty(
        "org1",
        "customProp1",
      );

      expect(errors).toHaveLength(0);

      expect(properties.customPropertyName).toBe("customProp1");
      expect(properties.data).toHaveLength(2);
      expect(properties.data).toContainEqual({
        repository: "repo1",
        oldValue: "old value 1",
        newValue: "",
      });
      expect(properties.data).toContainEqual({
        repository: "repo2",
        oldValue: "old value 3",
        newValue: "",
      });
    });

    test("updates properties", async () => {
      const github = new StubGithub(stubData);
      const customPropertyManager = new CustomPropertyManager(github);

      const newProperties = [
        {
          repository: "repo1",
          oldValue: "old value 1",
          newValue: "new value 1",
        },
        {
          repository: "repo2",
          oldValue: "old value 3",
          newValue: "",
        },
      ];
      const propertyChanges = new PropertyMapper("customProp1", newProperties);
      await customPropertyManager.setCustomProperties("org1", propertyChanges);

      const [errors, properties] = await customPropertyManager.getCustomProperty(
        "org1",
        "customProp1",
      );

      expect(errors).toHaveLength(0);

      expect(properties.customPropertyName).toBe("customProp1");
      expect(properties.data).toHaveLength(2);
      expect(properties.data).toContainEqual({
        repository: "repo1",
        oldValue: "new value 1",
        newValue: "",
      });
      expect(properties.data).toContainEqual({
        repository: "repo2",
        oldValue: "old value 3",
        newValue: "",
      });
    });

    test("undo property changes", async () => {
      const github = new StubGithub(stubData);
      const customPropertyManager = new CustomPropertyManager(github);

      const newProperties = [
        {
          repository: "repo1",
          oldValue: "old value 1",
          newValue: "new value 1",
        },
        {
          repository: "repo2",
          oldValue: "old value 3",
          newValue: "",
        },
      ];
      const propertyChanges = new PropertyMapper("customProp1", newProperties);
      await customPropertyManager.setCustomProperties("org1", propertyChanges);
      await customPropertyManager.undoCustomProperties("org1", propertyChanges);

      const [errors, properties] = await customPropertyManager.getCustomProperty(
        "org1",
        "customProp1",
      );

      expect(errors).toHaveLength(0);

      expect(properties.customPropertyName).toBe("customProp1");
      expect(properties.data).toHaveLength(2);
      expect(properties.data).toContainEqual({
        repository: "repo1",
        oldValue: "old value 1",
        newValue: "",
      });
      expect(properties.data).toContainEqual({
        repository: "repo2",
        oldValue: "old value 3",
        newValue: "",
      });
    });
  });
});
