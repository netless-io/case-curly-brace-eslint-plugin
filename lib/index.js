"use strict";

module.exports = {
    rules: {
        "case-curly-brace": require("./rules/case-curly-brace"),
    },
    configs: {
        recommended: {
            plugins: ["netless"],
            rules: {
                "netless/case-curly-brace": "error"
            }
        }
    },
}