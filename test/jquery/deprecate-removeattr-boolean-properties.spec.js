const snippet = "jquery/deprecate-removeattr-boolean-properties";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `
      $(this).removeAttr('checked');
      $(this).removeAttr('disabled');
      $this.removeAttr('readonly');
      $this.removeAttr('selected');
    `,
    output: `
      $(this).prop('checked', false);
      $(this).prop('disabled', false);
      $this.prop('readonly', false);
      $this.prop('selected', false);
    `,
    snippet,
  });
});
