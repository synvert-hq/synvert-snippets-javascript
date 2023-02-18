const snippet = "jquery/deprecate-size";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `
      $('.active').size()
      $this.size()
    `,
    output: `
      $('.active').length
      $this.length
    `,
    snippet,
  });
});
