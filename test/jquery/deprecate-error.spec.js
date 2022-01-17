require("../../lib/jquery/deprecate-error");
const { assertConvert } = require("../utils");

describe("jquery/deprecate-error", () => {
  assertConvert({
    input: `
      $(this).error(function () { console.log('error') });
    `,
    output: `
      $(this).on('error', function () { console.log('error') });
    `,
    snippet: "jquery/deprecate-error",
  });
});
