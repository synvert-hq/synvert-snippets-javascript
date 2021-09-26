require("../../lib/javascript/prefer-object-has-own");
const { assertConvert } = require("../utils");

describe("javascript/prefer-object-has-own", () => {
  const input = `
    Object.prototype.hasOwnProperty.call({ prop: 42 }, 'prop')
  `;

  const output = `
    Object.hasOwn({ prop: 42 }, 'prop')
  `;

  assertConvert({
    input,
    output,
    snippet: "javascript/prefer-object-has-own",
  });
});
