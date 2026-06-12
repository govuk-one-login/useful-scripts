import type { ArgumentsCamelCase } from "yargs";
import { CustomPropertyManager } from "../github/custom-property-manager.ts";
import type { Github } from "../github/github.ts";
import { PropertyMapper } from "../map/property-map.ts";
import fs from "node:fs";

export const undo =
  (github: Github) =>
  async ({
    filename,
    org,
  }: ArgumentsCamelCase<{ filename: string; org: string }>) => {
    const manager = new CustomPropertyManager(github);
    const csvData = fs.readFileSync(filename).toString();
    const map = PropertyMapper.fromCsv(csvData);

    const errors = await manager.undoCustomProperties(org, map);

    // Log errors
    if (errors.length > 0) {
      console.error("One of more errors occured:");
      errors.forEach((error) => console.error(`- ${error.message}`));
    }
  };
