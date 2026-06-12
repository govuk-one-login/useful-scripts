import * as js from "@eslint/js";
import * as globals from "globals";
import tsEslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import * as prettier from "eslint-config-prettier";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },
  tsEslint.configs.recommended,
  prettier,
  globalIgnores(["node_modules", "dist"]),
]);
