import { PropertyMapper } from "../map/property-map.ts";
import type { Github } from "./github.ts";

export class CustomPropertyManager {
  constructor(private github: Github) {}

  async getCustomProperty(
    org: string,
    property: string,
  ): Promise<PropertyMapper> {
    // Get all repositories for the organisation
    const repositories = await this.github.getRepositories(org);

    // Get each custom property and turn it into a map
    const mappings = await Promise.all(
      repositories.map(async (repository) => {
        const customPropertyValue = await this.github.getCustomProperty(
          org,
          repository,
          property,
        );
        return {
          repository,
          oldValue: customPropertyValue,
          newValue: "",
        };
      }),
    );

    // Turn the array of maps into a collection
    return new PropertyMapper(property, mappings);
  }

  async setCustomProperties(org: string, propertyMapper: PropertyMapper) {
    const changes = propertyMapper.getChanges();

    await Promise.all(
      changes.map(async (change) => {
        await this.github.setCustomProperty(
          org,
          change.repository,
          propertyMapper.customPropertyName,
          change.oldValue,
          change.newValue,
        );
      }),
    );
  }

  async undoCustomProperties(org: string, propertyMapper: PropertyMapper) {
    const changes = propertyMapper.getChanges();

    await Promise.all(
      changes.map(async (change) => {
        await this.github.setCustomProperty(
          org,
          change.repository,
          propertyMapper.customPropertyName,
          // These values are reversed for an undo
          change.newValue,
          change.oldValue,
        );
      }),
    );
  }
}
