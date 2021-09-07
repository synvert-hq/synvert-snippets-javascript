require("../../lib/javascript/prefer-string-trim-start-end");
const { assertConvert } = require('../utils');

describe("Prefer String trimStart and trimEnd", () => {
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
    snippet: "javascript/preferStringTrimStartEnd"
  });
});
