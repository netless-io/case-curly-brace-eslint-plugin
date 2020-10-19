"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "when using case, be sure to use it with curly braces",
            category: "Best Practices",
            recommended: true,
            url: "https://github.com/netless-io/case-curly-brace/blob/master/docs/rules/case-curly-brace.md"
        },

        schema: [],

        fixable: "code",

        messages: {
            missCurlyBrace: "when using case, there is no corresponding curly braces."
        }
    },

    create(context) {
        return {
            SwitchCase(node) {
                const consequent = node.consequent;
                // e.g:
                // case "x":
                // case "y":
                //     break;
                // when node is `case "x":`, the consequent length is 0
                if (consequent.length === 0) {
                    return;
                }

                if (consequent[0].type !== "BlockStatement") {
                    context.report({
                        node: consequent[0],
                        messageId: "missCurlyBrace",
                        fix: fixer =>  {
                            const leftRange = consequent[0].range;
                            const rightParen = consequent[consequent.length - 1].range;
                            return [
                                fixer.insertTextBeforeRange(leftRange, "{"),
                                fixer.insertTextAfterRange(rightParen, "}")
                            ];
                        },
                    })
                }
            }
        }
    }
};