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
    withNode({ type: "CallExpression", callee: { type: "MemberExpression", object: { in: ['$', 'jQuery'] }, property: 'ajax' }, arguments: { length: 1, first: { type: 'ObjectExpression' } } }, () => {
      const column = this.currentNode.arguments[0].loc.end.column - 1;
      const functionMap = { success: 'done', error: 'fail', complete: 'always' };
      Object.keys(functionMap).forEach(oldFunctionName => {
        let functionNode;
        withNode({ type: "Property", key: oldFunctionName }, () => {
          functionNode = this.currentNode;
          remove();
        });
        if (functionNode) {
          insert("\n" + indent(`.${functionMap[oldFunctionName]}(${functionNode.value.fixIndentToSource()})`, column), { at: 'end' } );
        }
      });
    });
  });
});
