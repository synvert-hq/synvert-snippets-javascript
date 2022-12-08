const snippet = "javascript/prefer-bind-operator";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  const input = `let x = this.foo.bind(this);`;
  const output = `let x = ::this.foo;`;

  assertConvert({
    input,
    output,
    snippet,
  });
});
