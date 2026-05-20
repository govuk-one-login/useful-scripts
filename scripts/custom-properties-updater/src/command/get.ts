import type { ArgumentsCamelCase } from "yargs";
import type { Github } from "../github/github.ts";
import fs from "node:fs";
import { CustomPropertyManager } from "../github/custom-property-manager.ts";

export const get =
  (github: Github) =>
  async ({
    property,
    output,
    org,
  }: ArgumentsCamelCase<{
    property: string;
    org: string;
    output?: string;
  }>) => {
    const manager = new CustomPropertyManager(github);
    const map = await manager.getCustomProperty(org, property);

    // Write the out
    if (output) {
      fs.writeFileSync(output, map.toCsv());
    } else {
      console.log(map.toCsv());
    }
  };
