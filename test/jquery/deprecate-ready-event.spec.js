const snippet = "jquery/deprecate-ready-event";
require(`../../lib/${snippet}`);
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `
      $(document).on("ready", fn)
      $(document).ready(fn)
    `,
    output: `
      $(fn)
      $(fn)
    `,
    snippet,
  });
});
