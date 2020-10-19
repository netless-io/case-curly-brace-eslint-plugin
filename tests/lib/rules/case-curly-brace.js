"use strict";

const rule = require("../../../lib/rules/case-curly-brace");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester();

ruleTester.run("case-curly-brace", rule, {
    valid: [
        {
            code: "switch (a) { case 1: { console.log(1); break; } default: { console.log(2); break; } }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "switch (a) { case 1: case 2: { console.log(2); break; } default: { console.log(3); break; } }",
            parserOptions: { ecmaVersion: 6 }
        }
    ],
    invalid: [
        {
            code: "switch (a) { case 1: console.log(1); break; }",
            output: "switch (a) { case 1: {console.log(1); break;} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "missCurlyBrace", type: "ExpressionStatement" }]
        },
        {
            code: "switch (a) { case 1: case 2: console.log(2); }",
            output: "switch (a) { case 1: case 2: {console.log(2);} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "missCurlyBrace", type: "ExpressionStatement" }]
        },
        {
            code: "switch (a) { default: console.log(3); }",
            output: "switch (a) { default: {console.log(3);} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "missCurlyBrace", type: "ExpressionStatement" }]
        },
    ],
})