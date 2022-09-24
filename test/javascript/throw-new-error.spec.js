const snippet = "javascript/throw-new-error";
require(`../../lib/${snippet}`);
const { assertConvert } = require("../utils");

describe(snippet, () => {
  describe("exists", () => {
    assertConvert({
      input: `
        throw Error();
        throw TypeError('unicorn');
        throw lib.TypeError();
      `,
      output: `
        throw new Error();
        throw new TypeError('unicorn');
        throw new lib.TypeError();
      `,
      snippet,
    });
  });
});
