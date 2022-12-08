const snippet = "jquery/quote-attribute-selector-with-number-sign";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `
      $('a[href=#main]')
      $("a[href=#main]")
      $('.active')
    `,
    output: `
      $('a[href="#main"]')
      $("a[href='#main']")
      $('.active')
    `,
    snippet,
  });
});
