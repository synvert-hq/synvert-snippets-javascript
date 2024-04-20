new Synvert.Rewriter("jquery", "deprecate-error", () => {
  description(`
    JQMIGRATE: jQuery.fn.error() is deprecated
    Cause: The $().error() method was used to attach an "error" event to an element but has been removed in 1.9 to reduce confusion with the $.error() method which is unrelated and has not been deprecated. It also serves to discourage the temptation to use $(window).error() which does not work because window.onerror does not follow standard event handler conventions. The $().error() method was removed in jQuery 3.0.

    Solution: Change any use of $().error(fn) to $().on("error", fn).
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  ifNpm("jquery", ">= 3.0");

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression
          [expression=~/^(\\$|jQuery)/]
          [name=error]]
        [arguments.length=1]`,
      () => {
        replaceWith(`{{expression.expression}}.on(${wrapWithQuotes("error")}, {{arguments.0}})`);
      }
    );
  });
});
