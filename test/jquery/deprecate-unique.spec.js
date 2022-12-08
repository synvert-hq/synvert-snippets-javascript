const snippet = "jquery/deprecate-unique";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `$.unique(array)`,
    output: `$.uniqueSort(array)`,
    snippet,
  });
});
