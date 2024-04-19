const snippet = "jquery/deprecate-live";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `$("a.foo").live("click", fn)`,
    output: `$(document).on("click", "a.foo", fn)`,
    snippet,
  });
});
