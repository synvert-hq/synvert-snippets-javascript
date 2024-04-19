const snippet = "jquery/deprecate-die";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `$("a.foo").die("click")`,
    output: `$(document).off("click", "a.foo")`,
    snippet,
  });
});
