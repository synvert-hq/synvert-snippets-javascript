const Synvert = require("synvert-core");

new Synvert.Rewriter("jquery", "deprecate-jqxhr-success-error-and-complete", () => {
  description(`
    JQMIGRATE: jQXHR.success is deprecated and removed
    JQMIGRATE: jQXHR.error is deprecated and removed
    JQMIGRATE: jQXHR.complete is deprecated and removed
    Cause: The .success(), .error(), and .complete() methods of the jQXHR object returned from jQuery.ajax() have been deprecated since jQuery 1.8 and were removed in jQuery 3.0.

    Solution: Replace the use of these methods with the standard Deferred methods: .success() becomes .done(), .error() becomes .fail(), and .complete() becomes .always().
  `);

  withinFiles(Synvert.ALL_FILES, function () {
    const functionMap = { success: "done", error: "fail", complete: "always" };
    withNode(
      {
        type: "CallExpression",
        callee: { type: "MemberExpression", property: { in: Object.keys(functionMap) } },
        arguments: { length: 1 },
      },
      function () {
        ifExistNode(
          { type: "MemberExpression", object: { in: ["$", "jQuery"] }, property: "ajax" },
          { in: "callee" },
          () => {
            replace("callee.property", { with: functionMap[this.currentNode.callee.property.name] });
          }
        );
      }
    );
  });
});
