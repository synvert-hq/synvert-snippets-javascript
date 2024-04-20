const snippet = "jquery/deprecate-bind-unbind";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `
      $(this).bind("click", function () { console.log('bind') });
      $(this).unbind("click");
    `,
    output: `
      $(this).on("click", function () { console.log('bind') });
      $(this).off("click");
    `,
    snippet,
  });
});
