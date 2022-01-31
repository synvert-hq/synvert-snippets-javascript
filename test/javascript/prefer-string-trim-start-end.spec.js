const snippet = "javascript/prefer-string-trim-start-end";
require(`../../lib/${snippet}`);
const { assertConvert } = require("../utils");

describe(snippet, () => {
  const input = `
    const foo1 = bar.trimLeft();
    const foo2 = bar.trimRight();
  `;

  const output = `
    const foo1 = bar.trimStart();
    const foo2 = bar.trimEnd();
  `;

  assertConvert({
    input,
    output,
    snippet,
  });
});
