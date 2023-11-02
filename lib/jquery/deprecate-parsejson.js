new Synvert.Rewriter("jquery", "deprecate-parsejson", () => {
  description(`
    JQMIGRATE: jQuery.parseJSON is deprecated; use JSON.parse
    Cause: The jQuery.parseJSON method in recent jQuery is identical to the native JSON.parse. As of jQuery 3.0 jQuery.parseJSON is deprecated.

    Solution: Replace any use of jQuery.parseJSON with JSON.parse.
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(`.CallExpression[expression=.PropertyAccessExpression[expression IN ($ jQuery)][name=parseJSON]][arguments.length=1]`, () => {
      replace("expression", { with: "JSON.parse" });
    });
  });
});
