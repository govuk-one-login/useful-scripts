import { parse, stringify } from "csv/sync";

export type PropertyMapping = {
  repository: NonNullable<string>;
  oldValue: NonNullable<string>;
  newValue: NonNullable<string>;
};

export type PropertyMap = PropertyMapping[];

type PropertyMapCsvRow = {
  repository: NonNullable<string>;
  [property: string]: NonNullable<string>;
  newValue: NonNullable<string>;
};

type PropertyMapCsv = PropertyMapCsvRow[];

const getCustomPropertyNameFromMapCsv = (mapping: unknown): string => {
  if (typeof mapping !== "object" || mapping === null) {
    throw new Error("mapping must be an object");
  }

  const keys = Object.keys(mapping);
  if (keys.length !== 3) {
    throw new Error(
      "mapping must contain 'repository' and 'newValue' and exactly one other field",
    );
  }

  return (
    keys.find((key) => key !== "repository" && key !== "newValue") ||
    "failedToDetectCustomPropertyName" // This shouldn't happen because we tested it above but find doesn't know that
  );
};

const isPropertyMapCsvRow = (
  mapping: unknown,
  propertyName: string,
): mapping is PropertyMapCsvRow =>
  typeof mapping === "object" &&
  mapping !== null &&
  "repository" in mapping &&
  typeof mapping.repository === "string" &&
  "newValue" in mapping &&
  typeof mapping.newValue === "string" &&
  propertyName in mapping &&
  // @ts-expect-error TS7053 -- not sure why its complaining, you most certainly can index with a string
  typeof mapping[propertyName as any] === "string";

const isPropertyMapCsv = (mappings: unknown): mappings is PropertyMapCsv => {
  if (!Array.isArray(mappings) || !mappings.length) {
    return false;
  }

  const propertyName = getCustomPropertyNameFromMapCsv(mappings[0]);
  return mappings.every((mapping) =>
    isPropertyMapCsvRow(mapping, propertyName),
  );
};

export class PropertyMapper {
  constructor(
    public readonly customPropertyName: string,
    public readonly data: PropertyMap = [],
  ) {}

  toCsv(): string {
    return stringify(this.data, {
      header: true,
      columns: [
        { key: "repository" },
        { key: "oldValue", header: this.customPropertyName },
        { key: "newValue" },
      ],
    });
  }

  static fromCsv(csvString: string): PropertyMapper {
    const csv = parse(csvString, { columns: true });
    if (csv.length === 0) {
      throw new Error("No data was provided");
    }

    if (!isPropertyMapCsv(csv)) {
      throw new Error("Invalid csv data provided");
    }

    const propertyName = getCustomPropertyNameFromMapCsv(csv[0]);
    const data = csv.map(
      (row): PropertyMapping => ({
        repository: row.repository,
        oldValue: row[propertyName] || "", // Should never get the empty string because the propertyName _should_ be correct
        newValue: row.newValue,
      }),
    );

    // @ts-ignore there is a type check inside the constructor
    return new PropertyMapper(propertyName, data);
  }

  getChanges(): PropertyMap {
    return this.data.filter((item) => !!item.newValue);
  }
}
