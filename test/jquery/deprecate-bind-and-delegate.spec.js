require("../../lib/jquery/deprecate-bind-and-delegate");
const { assertConvert } = require("../utils");

describe("jquery/deprecate-bind-and-delegate", () => {
  assertConvert({
    input: `
      $(this).bind("click", function () { console.log('bind') });
      $(this).unbind("click");

      $(this).delegate(selector, event, handler);
      $(this).undelegate(selector, event, handler);
    `,
    output: `
      $(this).on("click", function () { console.log('bind') });
      $(this).off("click");

      $(this).on(event, selector, handler);
      $(this).off(event, selector, handler);
    `,
    snippet: "jquery/deprecate-bind-and-delegate",
  });
});
