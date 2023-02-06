const snippet = "jquery/deprecate-load-unload";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `
      $(this).load(function () { console.log("load") });
      $(this).unload(function () { console.log("unload") });
    `,
    output: `
      $(this).on("load", function () { console.log("load") });
      $(this).on("unload", function () { console.log("unload") });
    `,
    snippet,
  });
});
