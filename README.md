# eslint-plugin-netless

The coding style used by the netless development team

## Installation

```shell
yarn add @netless/eslint-plugin -D
```

## Usage

Configure in your ESLint config file:

```json
{
  "plugins": [
    "@netless"
  ],

  "rules": {
    "@netless/case-curly-brace": ["error"]
  }
}
```

## Rules:

case-curly-brace: [docs](https://github.com/netless-io/eslint-plugin-netless/blob/master/docs/rules/case-curly-brace.md) - Support Auto Fix