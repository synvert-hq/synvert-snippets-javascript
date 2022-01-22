require("../../lib/jquery/use-expr-pseudos");
const { assertConvert } = require("../utils");

describe("jquery/use-expr-pseudos", () => {
  assertConvert({
    input: `
      $.expr[':']
      $.expr.filters
    `,
    output: `
      $.expr.pseudos
      $.expr.pseudos
    `,
    snippet: "jquery/use-expr-pseudos",
  });
});
