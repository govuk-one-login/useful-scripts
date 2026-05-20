import type { Github } from "./github.ts";

type FakeRepository = {
  repository: string;
  organisation: string;
  customProperties: Record<string, string>;
};

export type GithubStubData = FakeRepository[];

export class StubGithub implements Github {
  constructor(public stubData: GithubStubData) {}

  async getRepositories(organisation: string): Promise<string[]> {
    return this.stubData
      .filter((stub) => stub.organisation === organisation)
      .map((stub) => stub.repository);
  }

  async getCustomProperty(
    organisation: string,
    repository: string,
    customProperty: string,
  ): Promise<string> {
    const repo = this.stubData.find(
      (stub) =>
        stub.organisation === organisation && stub.repository === repository,
    );

    if (!repo) {
      throw new Error("Repository not found");
    }

    if (!repo.customProperties[customProperty]) {
      throw new Error("Custom property not found");
    }

    return repo.customProperties[customProperty];
  }

  async setCustomProperty(
    organisation: string,
    repository: string,
    customProperty: string,
    oldValue: string,
    newValue: string,
  ): Promise<void> {
    const repo = this.stubData.find(
      (stub) =>
        stub.organisation === organisation && stub.repository === repository,
    );
    if (!repo) {
      throw new Error("Repository not found");
    }

    if (!repo.customProperties[customProperty]) {
      throw new Error("Custom property not found");
    }

    if (repo.customProperties[customProperty] !== oldValue) {
      throw new Error("Custom has changed since data was set, can not update");
    }

    repo.customProperties[customProperty] = newValue;
  }
}
