import { readFileSync } from "fs";
import { parseCsv, type CsvRow } from "./csv/csvParse.ts";
import { categoriseAccounts, ENVIRONMENTS, type EnvKey } from "./environments/categorise.ts";


export type MonthlyTotals = {
    month: string;
    envTotals: Partial<Record<EnvKey, number>>;
};

export type CostReport = {
    months: MonthlyTotals[];
    uncategorised: string[];
};

type CostExport = {
    accountNames: string[];
    monthRows: { month: string; costs: string[] }[];
};


const MONTH_PATTERN = /^\d{4}-\d{2}-\d{2}$/;


/*
CSV uses an account-grouped export from AWS Cost Explorer:
    "Linked account","ACCOUNT_NUMBER",
    "Linked account name","di-<account-name>-<environment>",
    "Linked account total","9004.0013",
    "2026-04-01","8752.0819",
    "2026-05-01","8359.09444"
*/
function parseCostExport(rows: CsvRow[]): CostExport | undefined {
    const header = rows[0]?.[0]?.trim();
    const nameRow = rows[1];
    const looksLikeCostExport =
        header === "Linked account" &&
        nameRow?.[0]?.trim() === "Linked account name" &&
        rows.some((r) => MONTH_PATTERN.test(r[0] ?? ""));

    if (!looksLikeCostExport || !nameRow) return undefined;

    const accountNames = nameRow.slice(1, -1);
    const monthRows = rows
        .filter((r) => MONTH_PATTERN.test(r[0] ?? ""))
        .map((r) => ({ month: r[0] as string, costs: r.slice(1, -1) }));

    return { accountNames, monthRows };
}

function sumByEnv(
    accountNames: string[],
    costs: string[],
): { totals: Partial<Record<EnvKey, number>>; badValues: string[] } {
    const totals: Partial<Record<EnvKey, number>> = {};
    const badValues: string[] = [];

    accountNames.forEach((name, i) => {
        const env = categoriseAccounts(name);
        if (!env) return;
        const raw = costs[i] ?? "";
        const value = Number(raw);
        if (raw.trim() === "" || Number.isNaN(value)) {
            badValues.push(name);
            return;
        }
        totals[env] = (totals[env] ?? 0) + value;
    });

    return { totals, badValues };
}

export function buildReport(data: CostExport): CostReport {
    const uncategorised = data.accountNames.filter(
        (name) => categoriseAccounts(name) === undefined,
    );

    const months = data.monthRows.map(({ month, costs }) => ({
        month,
        envTotals: sumByEnv(data.accountNames, costs).totals,
    }));

    return { months, uncategorised };
}

const formatCurrency = (n: number): string =>
    "$" +
    n.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const monthLabel = (isoDate: string): string =>
    new Date(isoDate).toLocaleString("default", {
        month: "long",
        timeZone: "UTC",
    });

/**
 * Render the report as an aligned text table, e.g.
 *
 *   Environment | April      | May        |
 *   ----------- | ---------- | ---------- |
 *   Development | $11,158.89 | $99,555.27 |
 *
 * with one column per month in the export. Only environments that appear in
 * the data are shown, in canonical order.
 */
export function renderTable(report: CostReport): string {
    const monthLabels = report.months.map(({ month }) => monthLabel(month));

    const present = ENVIRONMENTS.filter((env) =>
        report.months.some(({ envTotals }) => env.key in envTotals),
    );

    const cells = present.map((env) =>
        report.months.map(({ envTotals }) =>
            formatCurrency(envTotals[env.key] ?? 0),
        ),
    );

    const envColWidth = Math.max(
        "Environment".length,
        ...present.map((env) => env.label.length),
    );
    const monthColWidth = Math.max(
        12,
        ...monthLabels.map((label) => label.length),
        ...cells.flat().map((cell) => cell.length),
    );

    const pad = (value: string, width: number) => value.padEnd(width);
    const monthColumns = (values: string[]) =>
        values.map((v) => pad(v, monthColWidth)).join(" | ");

    const lines = [
        pad("Environment", envColWidth) + " | " + monthColumns(monthLabels) + " |",
        "-".repeat(envColWidth) +
        " | " +
        monthLabels.map(() => "-".repeat(monthColWidth)).join(" | ") +
        " |",
        ...present.map(
            (env, rowIndex) =>
                pad(env.label, envColWidth) +
                " | " +
                monthColumns(cells[rowIndex] ?? []) +
                " |",
        ),
    ];

    return lines.join("\n");
}

export function run(filename: string): void {
    let csv: string;
    try {
        csv = readFileSync(filename, "utf-8").trimStart();
    } catch {
        console.error(
            "File does not exist: Please check the filepath and try again",
        );
        return;
    }

    const data = parseCostExport(parseCsv(csv));
    if (!data) {
        console.error(
            "File format invalid: Only a CSV export from AWS Cost Explorer is compatible",
        );
        return;
    }

    const report = buildReport(data);

    console.log(renderTable(report));

    for (const name of report.uncategorised) {
        console.error(`${name} could not be categorised`);
    }
}
