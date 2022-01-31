const snippet = "jquery/use-expr-pseudos";
require(`../../lib/${snippet}`);
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `
      $.expr[':']
      $.expr.filters
    `,
    output: `
      $.expr.pseudos
      $.expr.pseudos
    `,
    snippet,
  });
});
