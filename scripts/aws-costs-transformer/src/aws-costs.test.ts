import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { readFileSync } from "fs";
import { run } from "./aws-costs.ts";

vi.mock("fs");

const mockedReadFileSync = vi.mocked(readFileSync);
let consoleLogSpy: ReturnType<typeof vi.spyOn>;
let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => { });
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });
});

afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
});

const stdout = () =>
    consoleLogSpy.mock.calls.map((call: unknown[]) => call[0]).join("\n");
const stderr = () =>
    consoleErrorSpy.mock.calls.map((call: unknown[]) => call[0]).join("\n");


describe("run", () => {
    test("logs an informative error when the file does not exist", () => {
        mockedReadFileSync.mockImplementation(() => {
            const error = new Error(
                "ENOENT: no such file or directory",
            ) as NodeJS.ErrnoException;
            error.code = "ENOENT";
            throw error;
        });
        run("does-not-exist.csv");
        expect(stderr()).toContain(
            "File does not exist: Please check the filepath and try again",
        );
    });

    test("logs an informative error when the format is not recognised", () => {
        mockedReadFileSync.mockReturnValue(`{ oops: "this is not a valid CSV" }`);
        run("test-file.json");
        expect(stderr()).toContain(
            "File format invalid: Only a CSV export from AWS Cost Explorer is compatible",
        );
    });

    test("lists accounts that cannot be categorised and excludes them", () => {
        const csv = `"Linked account","ACCOUNT_NUMBER",""
"Linked account name","di-test-service-bogus ($)","Total costs ($)"
"Linked account total","9004.0013","9004.0013"
"2026-04-01","8752.0819","8752.0819"
"2026-05-01","8359.09444","8359.09444"`;
        mockedReadFileSync.mockReturnValue(csv);
        run("bogus.csv");
        expect(stderr()).toContain("di-test-service-bogus ($) could not be categorised");
    });

    test("sums accounts by environment and prints cents", () => {
        const csv = `"Linked account","111","222","333",""
"Linked account name","di-a-dev ($)","di-b-development ($)","di-c-prod ($)","Total costs ($)"
"Linked account total","3","4","5","12"
"2026-04-01","1000.50","2000.25","4000.00","7000.75"
"2026-05-01","10.00","20.00","30.00","60.00"`;
        mockedReadFileSync.mockReturnValue(csv);
        run("valid.csv");
        expect(stdout()).toBe(
            `Environment | April        | May          |
----------- | ------------ | ------------ |
Development | $3,000.75    | $30.00       |
Production  | $4,000.00    | $30.00       |`,
        );
    });

    test("does not break when an account name contains a comma", () => {
        const csv = `"Linked account","111","222",""
"Linked account name","di-weird, name-prod ($)","di-b-dev ($)","Total costs ($)"
"Linked account total","3","4","7"
"2026-04-01","100.00","200.00","300.00"`;
        mockedReadFileSync.mockReturnValue(csv);
        run("comma.csv");
        const output = stdout();
        expect(output).toContain("Production  | $100.00");
        expect(output).toContain("Development | $200.00");
    });
});
