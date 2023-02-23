const snippet = "jquery/deprecate-hover";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `
      $(this).hover(fn1, fn2)
      $this.hover(fn1, fn2)
    `,
    output: `
      $(this).on("mouseenter", fn1).on("mouseleave", fn2)
      $this.on("mouseenter", fn1).on("mouseleave", fn2)
    `,
    snippet,
  });
});
