import type { ArgumentsCamelCase } from "yargs";
import type { Github } from "../github/github.ts";
import fs from "node:fs";
import { CustomPropertyManager } from "../github/custom-property-manager.ts";

export const get =
  (github: Github) =>
  async ({
    property,
    org,
    output = 1, // 1 = stdout
  }: ArgumentsCamelCase<{
    property: string;
    org: string;
    output: string | 1;
  }>) => {
    const manager = new CustomPropertyManager(github);
    const [errors, map] = await manager.getCustomProperty(org, property);

    // Log errors
    if (errors.length > 0) {
      console.error("One of more errors occured:");
      errors.forEach((error) => console.error(`- ${error.message}`));
    }

    // Write the csv out
    fs.writeFileSync(output, map.toCsv());
  };
