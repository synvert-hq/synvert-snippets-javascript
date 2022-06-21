const Synvert = require("synvert-core");

new Synvert.Rewriter("jquery", "use-expr-pseudos", () => {
  configure({ sourceType: 'script' });

  description(`
    JQMIGRATE: jQuery.expr[':'] is deprecated; use jQuery.expr.pseudos
    JQMIGRATE: jQuery.expr.filters is deprecated; use jQuery.expr.pseudos
    Cause: The standard way to add new custom selectors through jQuery is jQuery.expr.pseudos. These two other aliases are deprecated, although they still work as of jQuery 3.0.

    Solution: Rename any of the older usage to jQuery.expr.pseudos. The functionality is identical.
  `);

  withinFiles(Synvert.ALL_FILES, function () {
    // $.expr[':']
    // =>
    // $.expr.pseudos
    findNode(".MemberExpression[object=.MemberExpression[object IN ($ jQuery)][property=expr]][property.value=':']", () => {
      replaceWith("{{object}}.pseudos");
    });

    // $.expr.filters
    // =>
    // $.expr.pseudos
    findNode(".MemberExpression[object=.MemberExpression[object IN ($ jQuery)][property=expr]][property=filters]", () => {
      replace("property", { with: "pseudos" });
    });
  });
});
