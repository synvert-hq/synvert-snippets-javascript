const snippet = "javascript/use-strict";
require(`../../lib/${snippet}`);
const { assertConvert } = require("../utils");

describe(snippet, () => {
  describe("exists", () => {
    assertConvert({
      input: `'use strict'\nfoobar`,
      output: `'use strict'\nfoobar`,
      snippet,
    });
  });

  describe("does not exist", () => {
    assertConvert({
      input: `foobar`,
      output: `'use strict'\nfoobar`,
      snippet,
    });
  });
});
