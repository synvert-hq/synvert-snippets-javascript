require("../../lib/javascript/object-property-value-shorthand");
const { assertConvert } = require("../utils");

const snippet = "javascript/object-property-value-shorthand"

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
