
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { categoriseAccounts } from "./categorise.ts";
describe("categorising accounts", () => {
    test.each([
        ["di-ipv-core-dev ($)", "dev"],
        ["di-ipv-core-develop ($)", "dev"],
        ["di-ipv-core-development ($)", "dev"],
        ["di-ipv-core-devel ($)", "dev"],
        ["di-ipv-core-build ($)", "build"],
        ["di-ipv-core-stage ($)", "stage"],
        ["di-ipv-core-staging ($)", "stage"],
        ["di-ipv-core-int ($)", "int"],
        ["di-ipv-core-integration ($)", "int"],
        ["di-ipv-core-prod ($)", "prod"],
        ["di-ipv-core-production ($)", "prod"],
    ])("categorises %s as %s", (name, expected) => {
        expect(categoriseAccounts(name)).toBe(expected);
    });

    test("returns undefined when no environment token is present", () => {
        expect(categoriseAccounts("org-cribl-tooling ($)")).toBeUndefined();
        expect(categoriseAccounts("di-ipv-core-dr-exercise ($)")).toBeUndefined();
    });

    test("ignores case and the dollar suffix", () => {
        expect(categoriseAccounts("di-ipv-core-PROD")).toBe("prod");
    });
});
