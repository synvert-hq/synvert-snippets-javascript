const snippet = "jquery/deprecate-parsejson";
require(`../../lib/${snippet}`);
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `$.parseJSON(str)`,
    output: `JSON.parse(str)`,
    snippet,
  });
});
