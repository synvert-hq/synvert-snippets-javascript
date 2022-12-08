const snippet = "javascript/prefer-string-slice";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  const input = `
    foo.substr(start, length);
    foo.substring(indexStart, indexEnd);
  `;

  const output = `
    foo.slice(start, start + length);
    foo.slice(indexStart, indexEnd);
  `;

  assertConvert({
    input,
    output,
    snippet,
  });
});
