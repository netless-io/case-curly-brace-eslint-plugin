import caseCurlyBrace from "./rules/case-curly-brace";
import staticResourcesVariableName from "./rules/static-resources-variable-name";

export = {
    rules: {
        "case-curly-brace": caseCurlyBrace,
        "static-resources-variable-name": staticResourcesVariableName,
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
            },
        },
    },
};
