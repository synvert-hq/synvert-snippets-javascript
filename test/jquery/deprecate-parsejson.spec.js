require("../../lib/jquery/deprecate-parsejson");
const { assertConvert } = require("../utils");

describe("jquery/deprecate-parsejson", () => {
  assertConvert({
    input: `
      $.parseJSON(str)
    `,
    output: `
      JSON.parse(str)
    `,
    snippet: "jquery/deprecate-parsejson",
  });
});
