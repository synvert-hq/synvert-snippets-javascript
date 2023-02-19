const snippet = "jquery/deprecate-nodename";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `
      jQuery.nodeName(elem, "div")
      $.nodeName(elem, "div")
    `,
    output: `
      elem.nodeName.toLowerCase() === "div"
      elem.nodeName.toLowerCase() === "div"
    `,
    snippet,
  });
});
