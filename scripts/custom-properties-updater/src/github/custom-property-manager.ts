import { PropertyMapper, type PropertyMapping } from "../map/property-map.ts";
import type { Github } from "./github.ts";

const unknownToError = (e: unknown): Error => {
  if (e instanceof Error) {
    return e;
  }
  if (typeof e === "string") {
    return new Error(e);
  }
  return new Error(`An unknown error occurred: ${e}`);
};

export class CustomPropertyManager {
  constructor(private github: Github) {}

  async getCustomProperty(
    org: string,
    property: string,
  ): Promise<[Error[], PropertyMapper]> {
    const errors: Error[] = [];

    // Get all repositories for the organisation
    const repositories = await this.github.getRepositories(org);

    // Get each custom property and turn it into a map
    const mappings = await Promise.all(
      repositories.map(
        async (repository): Promise<PropertyMapping | undefined> => {
          try {
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
          } catch (e) {
            errors.push(unknownToError(e));
          }
        },
      ),
    );

    // Turn the array of maps into a collection.
    // Note: if an error occurs while getting the custom property, it will leave an undefined in the mappings array
    return [
      errors,
      new PropertyMapper(
        property,
        mappings.filter((mapping) => !!mapping),
      ),
    ];
  }

  async setCustomProperties(org: string, propertyMapper: PropertyMapper) {
    const errors: Error[] = [];

    const changes = propertyMapper.getChanges();

    console.log(
      `Updating custom property ${propertyMapper.customPropertyName}`,
    );

    await Promise.all(
      changes.map(async (change) => {
        console.log(
          `@${org}/${change.repository} : ${change.oldValue} -> ${change.newValue}`,
        );

        try {
          await this.github.setCustomProperty(
            org,
            change.repository,
            propertyMapper.customPropertyName,
            change.oldValue,
            change.newValue,
          );
        } catch (e) {
          errors.push(unknownToError(e));
        }
      }),
    );

    return errors;
  }

  async undoCustomProperties(
    org: string,
    propertyMapper: PropertyMapper,
  ): Promise<Error[]> {
    const errors: Error[] = [];

    const changes = propertyMapper.getChanges();

    console.log(`Undoing custom property ${propertyMapper.customPropertyName}`);

    await Promise.all(
      changes.map(async (change) => {
        console.log(
          `@${org}/${change.repository} : ${change.newValue} -> ${change.oldValue}`,
        );

        try {
          await this.github.setCustomProperty(
            org,
            change.repository,
            propertyMapper.customPropertyName,
            // These values are reversed for an undo
            change.newValue,
            change.oldValue,
          );
        } catch (e) {
          errors.push(unknownToError(e));
        }
      }),
    );
    return errors;
  }
}
