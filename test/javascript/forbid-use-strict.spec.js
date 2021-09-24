require("../../lib/javascript/forbid-use-strict");
const { assertConvert } = require("../utils");

describe("Forbid use strict", () => {
  describe("exists", () => {
    assertConvert({
      input: `'use strict'\nfoobar`,
      output: `foobar`,
      snippet: "javascript/forbidUseStrict",
    });
  });

  describe("does not exist", () => {
    assertConvert({
      input: `foobar`,
      output: `foobar`,
      snippet: "javascript/forbidUseStrict",
    });
  });
});
