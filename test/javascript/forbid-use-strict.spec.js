require("../../lib/javascript/forbid-use-strict");
const { assertConvert } = require("../utils");

describe("javascript/forbid-use-strict", () => {
  describe("exists", () => {
    assertConvert({
      input: `'use strict'\nfoobar`,
      output: `foobar`,
      snippet: "javascript/forbid-use-strict",
    });
  });

  describe("does not exist", () => {
    assertConvert({
      input: `foobar`,
      output: `foobar`,
      snippet: "javascript/forbid-use-strict",
    });
  });
});
