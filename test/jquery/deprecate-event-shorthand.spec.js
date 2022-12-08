const snippet = "jquery/deprecate-event-shorthand";
const { assertConvert } = require("../utils");

describe(snippet, () => {
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
    snippet,
  });
});
