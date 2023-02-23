const snippet = "jquery/deprecate-isnumeric";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `$.isNumeric(string)`,
    output: `isNaN(parseFloat(string))`,
    snippet,
  });
});
