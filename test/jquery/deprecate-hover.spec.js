const snippet = "jquery/deprecate-hover";
require(`../../lib/${snippet}`);
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `$this.hover(fn1, fn2)`,
    output: `$this.on("mouseenter", fn1).on("mouseover", fn2)`,
    snippet,
  });
});
