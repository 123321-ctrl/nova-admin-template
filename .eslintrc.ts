import type { Linter } from "eslint";

const config: Linter.Config = {
  root: true,

  env: {
    node: true,
    browser: true
  },

  parser: "vue-eslint-parser",

  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: "latest",
    sourceType: "module"
  },

  extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "plugin:@typescript-eslint/recommended", "prettier"],

  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-console": "warn",
    "vue/multi-word-component-names": "off"
  }
};

export default config;
