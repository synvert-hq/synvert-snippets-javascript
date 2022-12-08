const snippet = "jquery/deprecate-size";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `$('.active').size()`,
    output: `$('.active').length`,
    snippet,
  });
});
