require("../../lib/jquery/quote-attribute-selector-with-number-sign");
const { assertConvert } = require("../utils");

describe("jquery/quote-attribute-selector-with-number-sign", () => {
  assertConvert({
    input: `
      $('a[href=#main]')
      $('.active')
    `,
    output: `
      $('a[href="#main"]')
      $('.active')
    `,
    snippet: "jquery/quote-attribute-selector-with-number-sign",
  });
});
