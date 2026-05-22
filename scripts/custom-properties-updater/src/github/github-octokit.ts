import { Octokit } from "@octokit/core";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import type { Github } from "./github.ts";

export class OctokitGithub implements Github {
  #octokit;

  constructor(github_token: string = process.env.GITHUB_TOKEN ?? "") {
    if (!github_token) {
      throw new Error(
        "A GitHub token must be provided, visit: https://github.com/settings/personal-access-tokens",
      );
    }
    const RestOctokit = Octokit.plugin(restEndpointMethods, paginateRest);
    this.#octokit = new RestOctokit({ auth: github_token });
  }

  async getRepositories(organisation: string): Promise<string[]> {
    const data = await this.#octokit.paginate(
      this.#octokit.rest.repos.listForOrg,
      {
        org: organisation,
        type: "all",
        per_page: 100,
      },
    );

    return data.map(({ name }) => name);
  }

  async getCustomProperty(
    organisation: string,
    repository: string,
    customProperty: string,
  ): Promise<string> {
    return this.#octokit
      .paginate(
        this.#octokit.rest.repos.customPropertiesForReposGetRepositoryValues,
        {
          owner: organisation,
          repo: repository,
          per_page: 100,
        },
      )
      .then((result) => {
        // Find the specific property
        const property = result.find(
          (property) => property.property_name === customProperty,
        );
        if (!property) {
          return "";
        }

        if (Array.isArray(property.value)) {
          throw new Error("This application currently does not support arrays");
        }
        return property.value ?? "";
      })
      .catch((error) => {
        console.warn(
          `Failed to fetch any properties for ${repository}:`,
          error,
        );
        return "";
      });
  }

  async setCustomProperty(
    organisation: string,
    repository: string,
    customProperty: string,
    oldValue: string,
    newValue: string,
  ): Promise<void> {
    // Check the old value:
    const currentValue = await this.getCustomProperty(
      organisation,
      repository,
      customProperty,
    );
    if (currentValue !== oldValue) {
      throw new Error(
        `Did not update "${customProperty}" in "${repository}". The value had changed, expected "${oldValue}" found "${currentValue}"`,
      );
    }

    // Set the new value:
    await this.#octokit.rest.repos.customPropertiesForReposCreateOrUpdateRepositoryValues(
      {
        owner: organisation,
        repo: repository,
        properties: [
          {
            property_name: customProperty,
            value: newValue,
          },
        ],
      },
    );
  }
}
