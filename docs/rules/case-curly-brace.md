# case must be used with curly braces (case-curly-brace)

This rule requires that curly braces must be used explicitly when using `case`/`default`.
The specific reason can be seen in the [no-case-declarations rule](https://github.com/eslint/eslint/blob/7ad86dea02feceb7631943a7e1423cc8a113fcfe/docs/rules/no-case-declarations.md) and this rule is based on this, 
in order to ensure the uniformity of the code style

## Rule Details

Examples of incorrect code for this rule:

```javascript
/*eslint case-curly-brace: "error"*/
/*eslint-env es6*/

switch (foo) {
    case 1:
    case 2:
        console.log(1);
        break;
    case 3:
        console.log(3);
        break;
    default:
        console.log("default");
}
```

Examples of correct code for this rule:

```javascript
/*eslint case-curly-brace: "error"*/
/*eslint-env es6*/

switch (foo) {
    case 1:
    case 2: {
        console.log(1);
        break;
    }
    case 3: {
        console.log(3);
        break;
    }
    default: {
        console.log("default");
    }
}
```