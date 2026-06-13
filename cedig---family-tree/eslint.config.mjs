import { defineConfig } from "eslint/config";
import next from "eslint-config-next";
import tseslint from "typescript-eslint";

export default defineConfig([{
    plugins: {
        "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
        parser: tseslint.parser,
    },
    extends: [...next],
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "react-hooks/exhaustive-deps": "warn",
    },
}]);
