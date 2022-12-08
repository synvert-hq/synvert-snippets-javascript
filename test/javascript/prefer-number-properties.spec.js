const snippet = "javascript/prefer-number-properties";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  const input = `
    const foo = parseInt('10', 2);
    const foo = parseFloat('10.5');
    const foo = isNaN(10);
    const foo = isFinite(10);
    if (Object.is(foo, NaN)) {}
    const isPositiveZero = value => value === 0 && 1 / value === Infinity;
    const isNegativeZero = value => value === 0 && 1 / value === -Infinity;
  `;

  const output = `
    const foo = Number.parseInt('10', 2);
    const foo = Number.parseFloat('10.5');
    const foo = Number.isNaN(10);
    const foo = Number.isFinite(10);
    if (Object.is(foo, Number.NaN)) {}
    const isPositiveZero = value => value === 0 && 1 / value === Number.POSITIVE_INFINITY;
    const isNegativeZero = value => value === 0 && 1 / value === Number.NEGATIVE_INFINITY;
  `;

  assertConvert({
    input,
    output,
    snippet,
  });
});
