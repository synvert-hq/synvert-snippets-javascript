require("../../lib/jquery/deprecate-andself");
const { assertConvert } = require("../utils");

describe("jquery/deprecate-andself", () => {
  assertConvert({
    input: `
      $(e.target).parents("#userMenu").andSelf()
    `,
    output: `
      $(e.target).parents("#userMenu").addBack()
    `,
    snippet: "jquery/deprecate-andself",
  });
});
