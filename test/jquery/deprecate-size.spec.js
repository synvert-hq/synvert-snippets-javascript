require("../../lib/jquery/deprecate-size");
const { assertConvert } = require("../utils");

describe("jquery/deprecate-size", () => {
  assertConvert({
    input: `$('.active').size()`,
    output: `$('.active').length`,
    snippet: "jquery/deprecate-size",
  });
});
