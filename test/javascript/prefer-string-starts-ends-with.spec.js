const snippet = "javascript/prefer-string-starts-ends-with";
require(`../../lib/${snippet}`);
const { assertConvert } = require("../utils");

describe(snippet, () => {
  const input = `
    const foo = /^bar/.test(baz);
    const bar = /bar$/.test(baz);
  `;

  const output = `
    const foo = baz.startsWith("bar");
    const bar = baz.endsWith("bar");
  `;

  assertConvert({
    input,
    output,
    snippet,
  });
});
