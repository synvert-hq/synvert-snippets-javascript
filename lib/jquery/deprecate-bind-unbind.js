new Synvert.Rewriter("jquery", "deprecate-bind-unbind", () => {
  description(`
    JQMIGRATE: jQuery.fn.bind() is deprecated
    JQMIGRATE: jQuery.fn.unbind() is deprecated
    Cause:: These event binding methods have been deprecated in favor of the .on() and .off() methods which can handle both delegated and direct event binding. Although the older methods are still present in jQuery 3.0, they may be removed as early as the next major-version update.

    Solution: Change the method call to use .on() or .off(), the documentation for the old methods include specific instructions. In general, the .bind() and .unbind() methods can be renamed directly to .on() and .off() respectively since the argument orders are identical.
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  ifNpm("jquery", ">= 1.8");

  withinFiles(Synvert.ALL_FILES, function () {
    // $(this).bind("click", function () { console.log('bind') });
    // =>
    // $(this).on("click", function () { console.log('bind') });
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression
          [expression=~/^(\\$|jQuery)/]
          [name=bind]]
        [arguments.length=2]`,
      () => {
        replace("expression.name", { with: "on" });
      },
    );

    // $(this).unbind("click");
    // =>
    // $(this).off("click");
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression
          [expression=~/^(\\$|jQuery)/]
          [name=unbind]]
        [arguments.length>=1]`,
      () => {
        replace("expression.name", { with: "off" });
      },
    );
  });
});
