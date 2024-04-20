new Synvert.Rewriter("jquery", "deprecate-ready-event", () => {
  description(`
    JQMIGRATE: 'ready' event is deprecated
    Cause: Using one of jQuery's API methods to bind a "ready" event, e.g. $( document ).on( "ready", fn ), will cause the function to be called when the document is ready, but only if it is attached before the browser fires its own DOMContentLoaded event. That makes it unreliable for many uses, particularly ones where jQuery or its plugins are loaded asynchronously after page load.

    Solution: Replace any use of $( document ).on( "ready", fn ) with $( fn ). This approach works reliably even when the document is already loaded.
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  ifNpm("jquery", ">= 3.0");

  withinFiles(Synvert.ALL_FILES, function () {
    // $(document).on("ready", fn)
    // =>
    // $(fn)
    findNode(
      `.CallExpression
                [callee=.MemberExpression
                  [object=.CallExpression
                    [callee IN ($ jQuery)][arguments.length=1][arguments.0=.Identifier][arguments.0.name=document]]
                  [property=on]]
                [arguments.length=2][arguments.0=.Literal][arguments.0.value=ready]`,
      () => {
        group(() => {
          // prettier-ignore
          delete(["callee.object.arguments", "callee.property"]);
          // prettier-ignore
          delete("arguments.0");
        });
      },
    );
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression
          [expression=.CallExpression
            [expression IN ($ jQuery)]
            [arguments.length=1][arguments.0=document]]
          [name=on]]
        [arguments.length=2][arguments.0=.StringLiteral[text="ready"]]`,
      () => {
        replaceWith("{{expression.expression.expression}}({{arguments.1}})");
      },
    );

    // $(document).ready(fn)
    // =>
    // $(fn)
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression
          [expression=.CallExpression
            [expression IN ($ jQuery)]
            [arguments.length=1][arguments.0=document]]
          [name=ready]]
        [arguments.length=1]`,
      () => {
        replace("expression", { with: "{{expression.expression.expression}}" });
      },
    );
  });
});
