import { ESLintUtils, AST_NODE_TYPES } from "@typescript-eslint/experimental-utils";
import rule from "../../../lib/rules/static-resources-variable-name";

const ruleTester = new ESLintUtils.RuleTester({
    parser: "@typescript-eslint/parser",
});

ruleTester.run("static-resources-variable-name", rule, {
    valid: [
        {
            code: `import * as sendSVG from "./send.svg"`,
        },
        {
            code: `import sendPNG from "./send.png"`,
        },
        {
            code: `import "./a.less"`,
        },
        {
            code: `import js from "./send.js"`,
        },
        {
            code: `import contentTxt from "./send.txt"`,
            options: [
                {
                    staticType: ["txt"],
                    namingRule: "camelCase",
                },
            ],
        },
        {
            code: `const emailICO = require("./email.ico");`,
        },
    ],
    invalid: [
        {
            code: `import * as send from "./send.svg"`,
            output: `import * as sendSVG from "./send.svg"`,
            errors: [
                {
                    messageId: "missingResourceType",
                    type: AST_NODE_TYPES.ImportNamespaceSpecifier,
                },
            ],
        },
        {
            code: `import sendsvg from "./send.svg"`,
            output: `import sendSVG from "./send.svg"`,
            errors: [
                {
                    messageId: "missingResourceType",
                    type: AST_NODE_TYPES.ImportDefaultSpecifier,
                },
            ],
        },
        {
            code: `import * as sendJPEG from "./send.svg"`,
            output: `import * as sendJPEGSVG from "./send.svg"`,
            errors: [
                {
                    messageId: "missingResourceType",
                    type: AST_NODE_TYPES.ImportNamespaceSpecifier,
                },
            ],
        },
        {
            code: `import x from "./assets/image/back.svg"`,
            output: `import xSVG from "./assets/image/back.svg"`,
            errors: [
                {
                    messageId: "missingResourceType",
                    type: AST_NODE_TYPES.ImportDefaultSpecifier,
                },
            ],
        },
        {
            code: `const email = require("./email.ico");`,
            output: `const emailICO = require("./email.ico");`,
            errors: [
                {
                    messageId: "missingResourceType",
                    type: AST_NODE_TYPES.VariableDeclarator,
                },
            ],
        },
        {
            code: `const emailSVG = require("./email.ico");`,
            output: `const emailSVGICO = require("./email.ico");`,
            errors: [
                {
                    messageId: "missingResourceType",
                    type: AST_NODE_TYPES.VariableDeclarator,
                },
            ],
        },
    ],
});
