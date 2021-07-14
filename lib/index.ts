import caseCurlyBrace from "./rules/case-curly-brace";
import staticResourcesVariableName from "./rules/static-resources-variable-name";
import consistentTypeExports from "./rules/consistent-type-exports";

export = {
    rules: {
        "case-curly-brace": caseCurlyBrace,
        "static-resources-variable-name": staticResourcesVariableName,
        "consistent-type-exports": consistentTypeExports
    },
    configs: {
        recommended: {
            plugins: ["@netless"],
            parserOptions: {
                sourceType: "module",
            },
            parser: "@typescript-eslint/parser",
            rules: {
                "@netless/case-curly-brace": "error",
                "@netless/static-resources-variable-name": "error",
                "@netless/consistent-type-exports": "error",
            },
        },
    },
};
