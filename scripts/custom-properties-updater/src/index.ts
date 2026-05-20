import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { customProperties } from "./custom-property.ts";
import { update } from "./command/update.ts";
import { get } from "./command/get.ts";
import { OctokitGithub } from "./github/github-octokit.ts";

const github = new OctokitGithub();

yargs(hideBin(process.argv))
  .command(
    "get [property]",
    "get the value of this property for all repositories",
    (yargs) =>
      yargs
        .positional("property", {
          describe: "property to get",
          type: "string",
          demandOption: true,
          choices: customProperties,
        })
        .option("o", {
          alias: "org",
          demandOption: true,
          describe: "The organisation to scan",
          type: "string",
        })
        .option("output", {
          describe: "The file to write the output to",
          type: "string",
        }),
    get(github),
  )
  .command(
    "update [filename]",
    "update the property using the provided csv file",
    (yargs) =>
      yargs.positional("filename", {
        describe: "filename of the CSV to use to update properties",
        type: "string",
        demandOption: true,
      }),
    update(github),
  )
  .parse();
