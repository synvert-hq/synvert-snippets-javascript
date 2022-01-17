require("../../lib/jquery/prop-boolean-properties");
const { assertConvert } = require("../utils");

describe("jquery/prop-boolean-properties", () => {
  assertConvert({
    input: `
      $this.attr('checked', 'checked');
      $this.attr('disabled', true);
      $this.attr('readonly', 'readonly');
      $this.attr('selected', true);

      $this.attr('checked', false);
      $this.attr('disabled', false);
      $this.attr('readonly', false);
      $this.attr('selected', false);

      $this.removeAttr('checked');
      $this.removeAttr('disabled');
      $this.removeAttr('readonly');
      $this.removeAttr('selected');
    `,
    output: `
      $this.prop('checked', true);
      $this.prop('disabled', true);
      $this.prop('readonly', true);
      $this.prop('selected', true);

      $this.prop('checked', false);
      $this.prop('disabled', false);
      $this.prop('readonly', false);
      $this.prop('selected', false);

      $this.prop('checked', false);
      $this.prop('disabled', false);
      $this.prop('readonly', false);
      $this.prop('selected', false);
    `,
    snippet: "jquery/prop-boolean-properties",
  });
});
