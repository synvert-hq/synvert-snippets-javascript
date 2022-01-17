require("../../lib/jquery/deprecate-load-unload");
const { assertConvert } = require("../utils");

describe("jquery/deprecate-load-unload", () => {
  assertConvert({
    input: `
      $(this).load(function () { console.log('load') });
      $(this).unload(function () { console.log('unload') });
    `,
    output: `
      $(this).on('load', function () { console.log('load') });
      $(this).on('unload', function () { console.log('unload') });
    `,
    snippet: "jquery/deprecate-load-unload",
  });
});
