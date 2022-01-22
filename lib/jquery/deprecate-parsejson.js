const Synvert = require("synvert-core");

new Synvert.Rewriter("jquery", "deprecate-parsejson", () => {
  description(`
    JQMIGRATE: jQuery.parseJSON is deprecated; use JSON.parse
    Cause: The jQuery.parseJSON method in recent jQuery is identical to the native JSON.parse. As of jQuery 3.0 jQuery.parseJSON is deprecated.

    Solution: Replace any use of jQuery.parseJSON with JSON.parse.
  `);

  withinFiles(Synvert.ALL_FILES, function () {
    withNode(
      { type: "CallExpression", callee: { type: "MemberExpression", object: "$", property: "parseJSON" } },
      () => {
        replace("callee.object", { with: "JSON" });
        replace("callee.property", { with: "parse" });
      }
    );
  });
});
