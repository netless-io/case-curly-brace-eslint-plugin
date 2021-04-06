# the suffix of the variable when introducing static resources must be the resource type (static-resources-variable-name)

## Rule Details

Examples of incorrect code for this rule:

```javascript
/*static-resources-variable-name: "error"*/
/*eslint-env es6*/

import send from "./send.svg";
const email = require("./email.ico");
```

Examples of correct code for this rule:

```javascript
/*eslint case-curly-brace: "error"*/
/*eslint-env es6*/

import sendSVG from "./send.svg";
const emailICO = require("./email.ico");
```
