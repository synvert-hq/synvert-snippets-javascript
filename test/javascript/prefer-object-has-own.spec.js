require("../../lib/javascript/prefer-object-has-own");
const { assertConvert } = require('../utils');

describe("Prefer Object hasOwn", () => {
  const input = `
    Object.prototype.hasOwnProperty.call({ prop: 42 }, 'prop')
  `;

  const output = `
    Object.hasOwn({ prop: 42 }, 'prop')
  `;

  assertConvert({
    input,
    output,
    snippet: "javascript/preferObjectHasOwn"
  });
});
