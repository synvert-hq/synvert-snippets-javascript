const Synvert = require("synvert-core");

new Synvert.Rewriter("jquery", "use-expr-pseudos", () => {
  description(`
    JQMIGRATE: jQuery.expr[':'] is deprecated; use jQuery.expr.pseudos
    JQMIGRATE: jQuery.expr.filters is deprecated; use jQuery.expr.pseudos
    Cause: The standard way to add new custom selectors through jQuery is jQuery.expr.pseudos. These two other aliases are deprecated, although they still work as of jQuery 3.0.

    Solution: Rename any of the older usage to jQuery.expr.pseudos. The functionality is identical.
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    // $.expr[':']
    // =>
    // $.expr.pseudos
    findNode(
      `.ElementAccessExpression
        [expression=.PropertyAccessExpression[expression=$][name=expr]]
        [argumentExpression=.StringLiteral[text=":"]]`,
      () => {
        replaceWith("{{expression}}.pseudos");
      }
    );

    // $.expr.filters
    // =>
    // $.expr.pseudos
    findNode(
      `.PropertyAccessExpression
        [expression=.PropertyAccessExpression[expression=$][name=expr]]
        [name=filters]`,
      () => {
        replace("name", { with: "pseudos" });
      }
    );
  });
});
