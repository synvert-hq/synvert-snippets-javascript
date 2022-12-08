const snippet = "javascript/prefer-negative-index";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  const input = `
    foo.slice(foo.length - 2, foo.length - 1);
    foo.splice(foo.length - 1, 1);
    foo.at(foo.length - 1);
  `;

  const output = `
    foo.slice(-2, -1);
    foo.splice(-1, 1);
    foo.at(-1);
  `;

  assertConvert({
    input,
    output,
    snippet,
  });
});
