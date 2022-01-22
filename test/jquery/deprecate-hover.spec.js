require("../../lib/jquery/deprecate-hover");
const { assertConvert } = require("../utils");

describe("jquery/deprecate-hover", () => {
  assertConvert({
    input: `$this.hover(fn1, fn2)`,
    output: `$this.on("mouseenter", fn1).on("mouseover", fn2)`,
    snippet: "jquery/deprecate-hover",
  });
});
