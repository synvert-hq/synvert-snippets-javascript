const snippet = "javascript/object-property-value-shorthand"
require(`../../lib/${snippet}`);
const { assertConvert } = require("../utils");

describe(snippet, () => {
  const input = `
    const someObject = {
      cat: cat,
      dog: dog,
      bird: bird
    }
  `;

  const output = `
    const someObject = {
      cat,
      dog,
      bird
    }
  `;

  assertConvert({
    input,
    output,
    snippet,
  });
});
