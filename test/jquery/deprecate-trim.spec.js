const snippet = "jquery/deprecate-trim";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `$.trim(text)`,
    output: `text.trim()`,
    snippet,
  });
});
