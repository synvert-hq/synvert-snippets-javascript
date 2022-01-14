require("../../lib/jquery/deprecate-event-shorthand");
const { assertConvert } = require("../utils");

describe("jquery/deprecate-event-shorthand", () => {
  assertConvert({
    input: `
      $('#test').click(function(e) {
        foo();
      });

      $this.keyup(() => {
        bar();
      });

      $form.submit();
    `,
    output: `
      $('#test').on('click', function(e) {
        foo();
      });

      $this.on('keyup', () => {
        bar();
      });

      $form.trigger('submit');
    `,
    snippet: "jquery/deprecate-event-shorthand",
  });
});
