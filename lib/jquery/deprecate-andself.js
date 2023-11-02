new Synvert.Rewriter("jquery", "deprecate-andself", () => {
  description(`
    JQMIGRATE: jQuery.fn.andSelf() is deprecated and removed, use jQuery.fn.addBack()
    Cause: The .andSelf() method has been renamed to .addBack() as of jQuery 1.9 to better reflect its purpose of adding back the previous set of results. The old alias was removed in jQuery 3.0.

    Solution: Replace any use of .andSelf() with .addBack().
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression
          [expression=~/^(\\$|jQuery)/]
          [name=andSelf]]
        [arguments.length=0]`,
      () => {
        replace("expression.name", { with: "addBack" });
      },
    );
  });
});
