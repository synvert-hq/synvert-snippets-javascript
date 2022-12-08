const snippet = "javascript/prefer-spread";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  const input = `
    Array.from(set).map(element => foo(element));
    const array = array1.concat(array2);
    const characters = string.split('');
  `;

  const output = `
    [...set].map(element => foo(element));
    const array = [...array1, ...array2];
    const characters = [...string];
  `;

  assertConvert({
    input,
    output,
    snippet,
  });
});
