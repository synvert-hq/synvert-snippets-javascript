const snippet = "jquery/deprecate-isarray";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `$.isArray(arr)`,
    output: `Array.isArray(arr)`,
    snippet,
  });
});
