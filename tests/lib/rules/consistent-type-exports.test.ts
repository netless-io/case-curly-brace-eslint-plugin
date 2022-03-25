import { ESLintUtils } from "@typescript-eslint/experimental-utils";
import rule from "../../../lib/rules/consistent-type-exports";
import { AST_NODE_TYPES } from "@typescript-eslint/experimental-utils/dist/ts-estree";
import { getFixturesRootDir } from '../../utils';

const ruleTester = new ESLintUtils.RuleTester({
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2018,
        tsconfigRootDir: getFixturesRootDir(),
        project: './tsconfig.json',
    },
});

ruleTester.run("consistent-type-exports", rule, {
    valid: [
        {
            code: `
            export { a } from './exports/A';
            export type { A } from './exports/A';
            export { b } from './exports/B';
            export type { B, Bb } from './exports/B';
            export * from 'axios';
            const c = 1;
            console.log(c);
            `,
        },
    ],
    invalid: [
        {
            code: "export { A } from './exports/A';",
            errors: [{ messageId: "typeOverValue", type: AST_NODE_TYPES.Program }],
        },
        {
            code: `
                export type { A } from './exports/A';
                export { b, Bb } from './exports/B';
            `,
            errors: [{ messageId: "typeOverValue", type: AST_NODE_TYPES.Program }],
        },
    ],
});
