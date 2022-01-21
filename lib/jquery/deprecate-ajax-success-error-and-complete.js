const Synvert = require("synvert-core");

new Synvert.Rewriter("jquery", "deprecate-ajax-success-error-and-complete", () => {
  description(`
    JQMIGRATE: jQXHR.success is deprecated and removed
    JQMIGRATE: jQXHR.error is deprecated and removed
    JQMIGRATE: jQXHR.complete is deprecated and removed
    Cause: The .success(), .error(), and .complete() methods of the jQXHR object returned from jQuery.ajax() have been deprecated since jQuery 1.8 and were removed in jQuery 3.0.

    Solution: Replace the use of these methods with the standard Deferred methods: .success() becomes .done(), .error() becomes .fail(), and .complete() becomes .always().
  `);

  withinFiles(Synvert.ALL_FILES, function () {
    withNode(
      {
        type: "CallExpression",
        callee: { type: "MemberExpression", object: "$", property: "ajax" },
        arguments: { length: 1, first: { type: "ObjectExpression" } },
      },
      () => {
        let successFunctionNode, errorFunctionNode, completeFunctionNode;
        withNode({ type: "Property", key: "success" }, () => {
          successFunctionNode = this.currentNode;
          remove();
        });
        withNode({ type: "Property", key: "error" }, () => {
          errorFunctionNode = this.currentNode;
          remove();
        });
        withNode({ type: "Property", key: "complete" }, () => {
          completeFunctionNode = this.currentNode;
          remove();
        });
        const column = this.currentNode.arguments[0].loc.end.column - 1;
        if (successFunctionNode) {
          insert(`\n${" ".repeat(column)}.done(${successFunctionNode.value.toSource()})`, { at: "end" });
        }
        if (errorFunctionNode) {
          insert(`\n${" ".repeat(column)}.fail(${errorFunctionNode.value.toSource()})`, { at: "end" });
        }
        if (completeFunctionNode) {
          insert(`\n${" ".repeat(column)}.always(${completeFunctionNode.value.toSource()})`, { at: "end" });
        }
      }
    );
  });
});
