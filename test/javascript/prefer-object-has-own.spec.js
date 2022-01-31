const snippet = "javascript/prefer-object-has-own";
require(`../../lib/${snippet}`);
const { assertConvert } = require("../utils");

describe(snippet, () => {
  const input = `Object.prototype.hasOwnProperty.call({ prop: 42 }, 'prop')`;
  const output = `Object.hasOwn({ prop: 42 }, 'prop')`;

  assertConvert({
    input,
    output,
    snippet,
  });
});
