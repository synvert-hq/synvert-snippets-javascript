require("../../lib/jquery/convert-andself-to-addback");
const { assertConvert } = require("../utils");

describe("jquery/convert-andself-to-addback", () => {
  assertConvert({
    input: `
      $(e.target).parents("#userMenu").andSelf()
    `,
    output: `
      $(e.target).parents("#userMenu").addBack()
    `,
    snippet: "jquery/convert-andself-to-addback",
  });
});
