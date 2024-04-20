const snippet = "jquery/deprecate-iswindow";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `$.isWindow(obj)`,
    output: `(obj != null && obj === obj.window)`,
    snippet,
  });
});
