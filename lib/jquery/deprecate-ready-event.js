const Synvert = require("synvert-core");

new Synvert.Rewriter("jquery", "deprecate-ready-event", () => {
  description(`
    JQMIGRATE: 'ready' event is deprecated
    Cause: Using one of jQuery's API methods to bind a "ready" event, e.g. $( document ).on( "ready", fn ), will cause the function to be called when the document is ready, but only if it is attached before the browser fires its own DOMContentLoaded event. That makes it unreliable for many uses, particularly ones where jQuery or its plugins are loaded asynchronously after page load.

    Solution: Replace any use of $( document ).on( "ready", fn ) with $( fn ). This approach works reliably even when the document is already loaded.
  `);

  withinFiles(Synvert.ALL_FILES, function () {
    // $(document).on("ready", fn)
    // =>
    // $(fn)
    withNode(
      {
        type: "CallExpression",
        callee: {
          type: "MemberExpression",
          object: {
            type: "CallExpression",
            callee: { in: ["$", "jQuery"] },
            arguments: { length: 1, first: { type: "Identifier", name: "document" } },
          },
          property: "on",
        },
        arguments: { length: 2, first: { type: "Literal", value: "ready" } },
      },
      () => {
        deleteNode(["callee.object.arguments", "callee.property"]);
        deleteNode("arguments.0");
      }
    );

    // $(document).ready(fn)
    // =>
    // $(fn)
    withNode(
      {
        type: "CallExpression",
        callee: {
          type: "MemberExpression",
          object: {
            type: "CallExpression",
            callee: { in: ["$", "jQuery"] },
            arguments: { length: 1, first: { type: "Identifier", name: "document" } },
          },
          property: "ready",
        },
        arguments: { length: 1 },
      },
      () => {
        deleteNode(["callee.object.arguments", "callee.property"]);
      }
    );
  });
});
