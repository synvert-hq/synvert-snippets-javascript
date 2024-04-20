new Synvert.Rewriter("jquery", "deprecate-iswindow", () => {
  description(`
    JQMIGRATE: jQuery.isWindow() is deprecated
    Cause: This method returns true if its argument is thought to be a window element. It was created for internal use and is not a reliable way of detecting window for public needs.

    Solution: Remove any use of jQuery.isWindow() from code. If it is truly needed it can be replaced with a check for obj != null && obj === obj.window which was the test used inside this method.
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  ifNpm("jquery", ">= 3.3");

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(
      `.CallExpression[expression=.PropertyAccessExpression[expression in ($ jQuery)][name=isWindow]][arguments.length=1]`,
      () => {
        replaceWith("({{arguments.0}} != null && {{arguments.0}} === {{arguments.0}}.window)");
      }
    );
  });
});
