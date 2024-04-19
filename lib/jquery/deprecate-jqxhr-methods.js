new Synvert.Rewriter("jquery", "deprecate-jqxhr-methods", () => {
  description(`
    JQMIGRATE: jQXHR.success is deprecated and removed
    JQMIGRATE: jQXHR.error is deprecated and removed
    JQMIGRATE: jQXHR.complete is deprecated and removed
    Cause: The .success(), .error(), and .complete() methods of the jQXHR object returned from jQuery.ajax() have been deprecated since jQuery 1.8 and were removed in jQuery 3.0.

    Solution: Replace the use of these methods with the standard Deferred methods: .success() becomes .done(), .error() becomes .fail(), and .complete() becomes .always().
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  ifNpm("jquery", ">= 3.0");

  withinFiles(Synvert.ALL_FILES, function () {
    const functionMap = { success: "done", error: "fail", complete: "always" };
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression
          [expression=.CallExpression
            [expression IN (/\\$\\.ajax/ /jQuery\\.ajax/)]]
          [name IN (success error complete)]]
        [arguments.length=1]`,
      () => {
        replace("expression.name", { with: functionMap[this.currentNode.expression.name.escapedText] });
      }
    );
  });
});
