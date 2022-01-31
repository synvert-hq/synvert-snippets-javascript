const snippet = "jquery/use-camelcased-data-name";
require(`../../lib/${snippet}`);
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `
      $this.data('my-data');
      $this.data('my-data', 'value');
    `,
    output: `
      $this.data('myData');
      $this.data('myData', 'value');
    `,
    snippet,
  });
});
