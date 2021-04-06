import path from "path";
import { createRule } from "../utils/createRule";
import { TSESTree, TSESLint } from "@typescript-eslint/experimental-utils";

type Options = [
    {
        staticType?: string[];
        namingRule:
            | "upperCase" // TEXT
            | "lowerCase" // text
            | "camelCase"; // Text
    },
];

type MessageID = "missingResourceType";

export = createRule<Options, MessageID>({
    name: "static-resources-variable-name",
    meta: {
        type: "layout",

        docs: {
            description:
                "when assigning a static resource, its variable name must include the resource type",
            category: "Best Practices",
            recommended: "error",
        },

        schema: [
            {
                type: "object",
                additionalProperties: false,
                properties: {
                    staticType: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },
                    namingRule: {
                        type: "string",
                        enum: ["upperCase", "lowerCase", "camelCase"],
                    },
                },
            },
        ],

        fixable: "code",

        messages: {
            missingResourceType: "the variable name must have a static resource type",
        },
    },
    defaultOptions: [
        {
            staticType: ["ico", "png", "jpg", "jpeg", "mp3", "mp4", "svg"],
            namingRule: "upperCase",
        },
    ],
    create(context, [{ staticType, namingRule }]) {
        const checkAndFix = (
            variableName: string,
            filePath: string,
            node: TSESTree.Node,
            range: TSESLint.AST.Range,
        ): void => {
            if (typeof staticType === "undefined") {
                return;
            }

            const fileSuffix = path.extname(filePath).slice(1).toLowerCase();

            (staticType as string[]) = staticType.map(type => type.toLowerCase());

            if (!staticType.includes(fileSuffix)) {
                return;
            }

            if (variableName.endsWith(conversionByCase(namingRule, fileSuffix))) {
                return;
            }

            return context.report({
                node,
                messageId: "missingResourceType",
                fix: fixer => {
                    const diffNamingRule = variableName.toLowerCase().endsWith(fileSuffix);

                    const conversionFileSuffix = conversionByCase(namingRule, fileSuffix);

                    if (diffNamingRule) {
                        const newVariableName = `${variableName.slice(
                            0,
                            -1 * fileSuffix.length,
                        )}${conversionFileSuffix}`;

                        return [fixer.replaceTextRange(range, newVariableName)];
                    }

                    return [fixer.insertTextAfterRange(range, conversionFileSuffix)];
                },
            });
        };

        return {
            ImportDeclaration(node) {
                if (typeof staticType === "undefined") {
                    return;
                }

                if (node.specifiers.length === 0) {
                    return;
                }

                const importPath = node.source.value as string;
                const importVariableName = node.specifiers[0].local.name;

                checkAndFix(
                    importVariableName,
                    importPath,
                    node.specifiers[0],
                    node.specifiers[0].local.range,
                );
            },
            VariableDeclaration(node) {
                if (typeof staticType === "undefined") {
                    return;
                }

                if (node.declarations[0].id.type !== "Identifier") {
                    return;
                }

                if (!node.declarations[0].init) {
                    return;
                }

                if (node.declarations[0].init.type !== "CallExpression") {
                    return;
                }

                if (node.declarations[0].init.callee.type !== "Identifier") {
                    return;
                }

                if (node.declarations[0].init.callee.name !== "require") {
                    return;
                }

                if (node.declarations[0].init.arguments[0].type !== "Literal") {
                    return;
                }

                const requirePath = node.declarations[0].init.arguments[0].value as string;
                const requireVariableName = node.declarations[0].id.name;

                checkAndFix(
                    requireVariableName,
                    requirePath,
                    node.declarations[0],
                    node.declarations[0].id.range,
                );
            },
        };
    },
});

const conversionByCase = (namingRule: Options[0]["namingRule"], str: string): string => {
    switch (namingRule) {
        case "camelCase": {
            return str[0].toUpperCase().concat(str.slice(1));
        }
        case "lowerCase": {
            return str.toLowerCase();
        }
        case "upperCase": {
            return str.toUpperCase();
        }
    }
};
