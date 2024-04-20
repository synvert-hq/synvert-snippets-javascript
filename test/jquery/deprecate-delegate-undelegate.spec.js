const snippet = "jquery/deprecate-delegate-undelegate";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `
      $this.delegate(selector, event, handler);
      $this.undelegate(selector, event, handler);
    `,
    output: `
      $this.on(event, selector, handler);
      $this.off(event, selector, handler);
    `,
    snippet,
  });
});
