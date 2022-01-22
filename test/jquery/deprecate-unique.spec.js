require("../../lib/jquery/deprecate-unique");
const { assertConvert } = require("../utils");

describe("jquery/deprecate-unique", () => {
  assertConvert({
    input: `$.unique(array)`,
    output: `$.uniqueSort(array)`,
    snippet: "jquery/deprecate-unique",
  });
});
