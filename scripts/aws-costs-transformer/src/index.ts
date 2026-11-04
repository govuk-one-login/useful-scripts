import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { run } from "./aws-costs.ts";

yargs(hideBin(process.argv))
    .scriptName("aws-costs")
    .usage("$0 <command> [options]\n\nPrints AWS costs by environment from an AWS Cost Explorer CSV file grouped by account.")
    .command(
        "run [filename]",
        "print AWS costs grouped by environment from a AWS Cost explorer CSV file broken down by account",
        (yargs) =>
            yargs.positional("filename", {
                describe: "path to the AWS cost CSV file",
                type: "string",
                demandOption: true,
            }),
        (argv) => run(argv.filename),
    )
    .demandCommand()
    .parse();
