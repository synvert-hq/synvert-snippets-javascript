const snippet = "jquery/deprecate-isfunction";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `$.isFunction(x)`,
    output: `typeof x === "function"`,
    snippet,
  });
});
