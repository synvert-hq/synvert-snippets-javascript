require("../../lib/jquery/deprecate-isarray");
const { assertConvert } = require("../utils");

describe("jquery/deprecate-isarray", () => {
  assertConvert({
    input: `
      $.isArray(arr)
    `,
    output: `
      Array.isArray(arr)
    `,
    snippet: "jquery/deprecate-isarray",
  });
});
