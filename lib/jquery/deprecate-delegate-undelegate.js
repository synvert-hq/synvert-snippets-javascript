new Synvert.Rewriter("jquery", "deprecate-delegate-undelegate", () => {
  description(`
    JQMIGRATE: jQuery.fn.delegate() is deprecated
    JQMIGRATE: jQuery.fn.undelegate() is deprecated
    Cause:: These event binding methods have been deprecated in favor of the .on() and .off() methods which can handle both delegated and direct event binding. Although the older methods are still present in jQuery 3.0, they may be removed as early as the next major-version update.

    Solution: Change the method call to use .on() or .off(), the documentation for the old methods include specific instructions. In general, the .delegate() and .undelegate() methods can be renamed directly to .on() and .off() respectively since the argument orders are identical.
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  ifNpm("jquery", ">= 3.0");

  withinFiles(Synvert.ALL_FILES, function () {
    // $(this).delegate(selector, event, handler);
    // =>
    // $(this).on(event, selector, handler);
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression
          [expression=~/^(\\$|jQuery)/]
          [name=delegate]]
        [arguments.length>=3]`,
      () => {
        replace("expression.name", { with: "on" });
        replace("arguments.0", { with: "{{arguments.1}}" });
        replace("arguments.1", { with: "{{arguments.0}}" });
      }
    );

    // $(this).undelegate();
    // =>
    // $(this).off();
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression
          [expression=~/^(\\$|jQuery)/]
          [name=undelegate]]
        [arguments.length<3]`,
      () => {
        replace("expression.name", { with: "off" });
      }
    );

    // $(this).undelegate(selector, event, handler);
    // =>
    // $(this).off(event, selector, handler);
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression
          [expression=~/^(\\$|jQuery)/]
          [name=undelegate]]
        [arguments.length>=2]`,
      () => {
        group(() => {
          replace("expression.name", { with: "off" });
          replace("arguments.0", { with: "{{arguments.1}}" });
          replace("arguments.1", { with: "{{arguments.0}}" });
        });
      }
    );
  });
});
