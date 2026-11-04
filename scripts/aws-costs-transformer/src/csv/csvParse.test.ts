import { describe, expect, test } from "vitest";
import { parseCsv } from "./csvParse.ts";

describe("parseCsv", () => {
    test("parses simple rows", () => {
        expect(parseCsv("a,b,c\n1,2,3")).toStrictEqual([
            ["a", "b", "c"],
            ["1", "2", "3"],
        ]);
    });

    test("keeps commas that appear inside quoted fields", () => {
        expect(parseCsv('"Test, Words","x"')).toStrictEqual([
            ["Test, Words", "x"],
        ]);
    });

    test("handles escaped quotes and CRLF line endings", () => {
        expect(parseCsv('"a ""quoted"" value",b\r\nc,d')).toStrictEqual([
            ['a "quoted" value', "b"],
            ["c", "d"],
        ]);
    });

    test("preserves newlines embedded in quoted fields", () => {
        expect(parseCsv('"line one\nline two",b')).toStrictEqual([
            ["line one\nline two", "b"],
        ]);
    });
});
