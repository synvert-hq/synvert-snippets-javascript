require("../../lib/javascript/use-strict");
const { assertConvert } = require('../utils');

describe("Use strict", () => {
  describe("exists", () => {
    assertConvert({
      input: `'use strict'\nfoobar`,
      output: `'use strict'\nfoobar`,
      snippet: "javascript/useStrict"
    });
  });

  describe("does not exist", () => {
    assertConvert({
     input: `foobar`,
     output: `'use strict'\nfoobar`,
     snippet: "javascript/useStrict"
    });
  });
});
