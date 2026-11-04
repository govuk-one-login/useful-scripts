export type CsvRow = string[];

/**
 * AI GENERATED: dependency free CSV parser for an AWS cost explorer export
 * 
 * Parse CSV text into rows of fields, correctly handling quoted fields that
 * contain commas, embedded newlines, escaped quotes (""), and CRLF line
 * endings. This replaces a naive split(",") that corrupts columns whenever an
 * account name contains a comma.
 */
export function parseCsv(text: string): CsvRow[] {
    const rows: CsvRow[] = [];
    let row: string[] = [];
    let field = "";
    let inQuotes = false;
    let sawField = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (inQuotes) {
            if (char === '"') {
                if (text[i + 1] === '"') {
                    field += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                field += char;
            }
            continue;
        }

        if (char === '"') {
            inQuotes = true;
            sawField = true;
        } else if (char === ",") {
            row.push(field);
            field = "";
            sawField = true;
        } else if (char === "\n" || char === "\r") {
            if (char === "\r" && text[i + 1] === "\n") i++;
            if (sawField || field !== "" || row.length > 0) {
                row.push(field);
                rows.push(row);
            }
            row = [];
            field = "";
            sawField = false;
        } else {
            field += char;
            sawField = true;
        }
    }

    if (sawField || field !== "" || row.length > 0) {
        row.push(field);
        rows.push(row);
    }

    return rows;
}
