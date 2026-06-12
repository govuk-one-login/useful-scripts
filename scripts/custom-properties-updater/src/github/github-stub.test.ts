import { describe, expect, test } from "vitest";
import { type GithubStubData, StubGithub } from "./github-stub.ts";

describe("StubGithub", () => {
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

  describe("getRepositories", () => {
    test("it can get the repositories of a given org", async () => {
      const github = new StubGithub(stubData);

      const org1Repos = await github.getRepositories("org1");
      expect(org1Repos).toStrictEqual(["repo1", "repo2"]);

      const org2Repos = await github.getRepositories("org2");
      expect(org2Repos).toStrictEqual(["repo3"]);
    });
  });

  describe("getCustomProperties", async () => {
    test("it can get the value of a specific custom property for a specific repo", async () => {
      const github = new StubGithub(stubData);

      const org1Repo1Cp1 = await github.getCustomProperty(
        "org1",
        "repo1",
        "customProp1",
      );
      expect(org1Repo1Cp1).toBe("old value 1");

      const org1Repo2Cp1 = await github.getCustomProperty(
        "org1",
        "repo2",
        "customProp1",
      );
      expect(org1Repo2Cp1).toBe("old value 3");
    });

    test("it should error if the repo can not be found", async () => {
      const github = new StubGithub(stubData);

      const org1Repo1Cp1 = github.getCustomProperty(
        "org1",
        "repo3",
        "customProp1",
      );
      await expect(org1Repo1Cp1).rejects.toThrow(/Repository not found/);
    });

    test("it should error if the custom property is not found", async () => {
      const github = new StubGithub(stubData);

      const org1Repo1Cp1 = github.getCustomProperty(
        "org1",
        "repo1",
        "customProp3",
      );
      await expect(org1Repo1Cp1).rejects.toThrow(/Custom property not found/);
    });
  });

  describe("setCustomProperties", () => {
    const organisation = "orgToEdit";
    const repository = "repoToEdit";
    const customProperty = "customProperty";
    const oldValue = "old value";
    const newValue = "newValue";

    test("it can set the value of a custom property", async () => {
      const github = new StubGithub([
        {
          organisation,
          repository,
          customProperties: {
            [customProperty]: oldValue,
          },
        },
      ]);
      await github.setCustomProperty(
        organisation,
        repository,
        customProperty,
        oldValue,
        newValue,
      );

      const receivedValue = await github.getCustomProperty(
        organisation,
        repository,
        customProperty,
      );
      expect(receivedValue).toBe(receivedValue);
    });

    test("it should error if the repo can not be found", async () => {
      const github = new StubGithub([
        {
          organisation,
          repository,
          customProperties: {
            [customProperty]: oldValue,
          },
        },
      ]);

      const org1Repo1Cp1 = github.setCustomProperty(
        organisation,
        "repo3",
        customProperty,
        oldValue,
        newValue,
      );
      await expect(org1Repo1Cp1).rejects.toThrow(/Repository not found/);
    });

    test("it should error if the custom property is not found", async () => {
      const github = new StubGithub([
        {
          organisation,
          repository,
          customProperties: {
            [customProperty]: oldValue,
          },
        },
      ]);

      const org1Repo1Cp1 = github.setCustomProperty(
        organisation,
        repository,
        "customProp3",
        oldValue,
        newValue,
      );
      await expect(org1Repo1Cp1).rejects.toThrow(/Custom property not found/);
    });

    test("it should not allow you to change a value if the oldValue is wrong", async () => {
      const github = new StubGithub([
        {
          organisation,
          repository,
          customProperties: {
            [customProperty]: oldValue,
          },
        },
      ]);

      const setterPromise = github.setCustomProperty(
        organisation,
        repository,
        customProperty,
        "notTheOldValue",
        newValue,
      );

      await expect(setterPromise).rejects.toThrow(/can not update/);

      const receivedValue = await github.getCustomProperty(
        organisation,
        repository,
        customProperty,
      );
      expect(receivedValue).toBe(oldValue);
    });
  });
});
