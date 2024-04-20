const snippet = "jquery/deprecate-now";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `jQuery.now()`,
    output: `Date.now()`,
    snippet,
  });
});
