new Synvert.Rewriter("jquery", "deprecate-unique", () => {
  description(`
    JQMIGRATE: jQuery.unique is deprecated; use jQuery.uniqueSort
    Cause: The fact that jQuery.unique sorted its results in DOM order was surprising to many who did not read the documentation carefully. As of jQuery 3.0 this function is being renamed to make it clear.

    Solution: Replace all uses of jQuery.unique with jQuery.uniqueSort which is the same function with a better name.
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  ifNpm("jquery", ">= 3.0");

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression[expression IN ($ jQuery)][name=unique]]
        [arguments.length=1]`,
      () => {
        replace("expression.name", { with: "uniqueSort" });
      }
    );
  });
});
