import type { ArgumentsCamelCase } from "yargs";
import { CustomPropertyManager } from "../github/custom-property-manager.ts";
import type { Github } from "../github/github.ts";
import { PropertyMapper } from "../map/property-maps.ts";
import fs from "node:fs";

export const update =
  (github: Github) =>
  async ({
    filename,
    org,
  }: ArgumentsCamelCase<{ filename: string; org: string }>) => {
    const manager = new CustomPropertyManager(github);
    const csvData = fs.readFileSync(filename).toString();
    const map = PropertyMapper.fromCsv(csvData);

    await manager.setCustomProperty(org, map);
  };
