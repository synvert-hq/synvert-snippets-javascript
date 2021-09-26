require("../../lib/javascript/use-strict");
const { assertConvert } = require("../utils");

describe("javascript/use-strict", () => {
  describe("exists", () => {
    assertConvert({
      input: `'use strict'\nfoobar`,
      output: `'use strict'\nfoobar`,
      snippet: "javascript/use-strict",
    });
  });

  describe("does not exist", () => {
    assertConvert({
      input: `foobar`,
      output: `'use strict'\nfoobar`,
      snippet: "javascript/use-strict",
    });
  });
});
