require("../../lib/javascript/prefer-string-trim-start-end");
const { assertConvert } = require("../utils");

describe("javascript/prefer-string-trim-start-end", () => {
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
    snippet: "javascript/prefer-string-trim-start-end",
  });
});
