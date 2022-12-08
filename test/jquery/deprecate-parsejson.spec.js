const snippet = "jquery/deprecate-parsejson";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `$.parseJSON(str)`,
    output: `JSON.parse(str)`,
    snippet,
  });
});
