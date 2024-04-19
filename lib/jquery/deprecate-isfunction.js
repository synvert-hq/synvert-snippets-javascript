new Synvert.Rewriter("jquery", "deprecate-isfunction", () => {
  description(`
    JQMIGRATE: jQuery.isFunction() is deprecated
    Cause: This method returns true if its argument is thought to be a function. It was created to work around bugs in typeof implementations in legacy browsers.

    Solution: Replace any use of jQuery.isFunction( x ) with typeof x === "function".
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  ifNpm("jquery", ">= 3.0");

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(
      `.CallExpression[expression=.PropertyAccessExpression[expression in ($ jQuery)][name=isFunction]][arguments.length=1]`,
      () => {
        replaceWith('typeof {{arguments.0}} === "function"');
      }
    );
  });
});
