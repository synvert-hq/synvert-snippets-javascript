const snippet = "jquery/deprecate-size";
require(`../../lib/${snippet}`);
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `$('.active').size()`,
    output: `$('.active').length`,
    snippet,
  });
});
