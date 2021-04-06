import { ESLintUtils } from "@typescript-eslint/experimental-utils";

export const createRule = ESLintUtils.RuleCreator(
    name => `https://github.com/netless-io/eslint-plugin/blob/master/docs/rules/${name}.md`,
);
