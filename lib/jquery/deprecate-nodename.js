new Synvert.Rewriter("jquery", "deprecate-nodename", () => {
  description(`
    JQMIGRATE: jQuery.nodeName() is deprecated
    Cause: This public but never-documented method has been deprecated as of jQuery 3.2.0.

    Solution: Replace calls such as jQuery.nodeName( elem, "div" ) with a test such as elem.nodeName.toLowerCase() === "div".
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression[expression IN ($ jQuery)][name=nodeName]]
        [arguments.length=2][arguments.1=.StringLiteral]`,
      () => {
        replaceWith("{{arguments.0}}.{{expression.name}}.toLowerCase() === {{arguments.1}}");
      }
    );
  });
});
