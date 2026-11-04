
export const ENVIRONMENTS = [
    { key: "dev", label: "Development", aliases: ["dev", "develop", "development", "devel"] },
    { key: "build", label: "Build", aliases: ["build"] },
    { key: "stage", label: "Staging", aliases: ["stage", "staging"] },
    { key: "int", label: "Integration", aliases: ["int", "integration"] },
    { key: "prod", label: "Production", aliases: ["prod", "production"] },
] as const;

export type EnvKey = (typeof ENVIRONMENTS)[number]["key"];

const ALIAS_TO_KEY: ReadonlyArray<readonly [alias: string, key: EnvKey]> =
    ENVIRONMENTS.flatMap((env) =>
        env.aliases.map((alias) => [alias, env.key] as const),
    ).sort(([a], [b]) => b.length - a.length);


export function categoriseAccounts(accountName: string): EnvKey | undefined {
    const name = accountName.replace(/\s*\(\$\)\s*$/, "").trim();
    const lastToken = name.split("-").pop()?.toLowerCase() ?? "";
    for (const [alias, key] of ALIAS_TO_KEY) {
        if (lastToken === alias) return key;
    }
    return undefined;
}