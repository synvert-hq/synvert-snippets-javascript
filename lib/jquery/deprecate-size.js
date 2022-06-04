const Synvert = require("synvert-core");

new Synvert.Rewriter("jquery", "deprecate-size", () => {
  description(`
    JQMIGRATE: jQuery.fn.size() is deprecated and removed; use the .length property
    Cause: The .size() method returns the number of elements in the current jQuery object, but duplicates the more-efficient .length property which provides the same functionality. As of jQuery 1.9 the .length property is the preferred way to retrieve this value. jQuery 3.0 no longer contains the .size() method.

    Solution: Replace any use of .size() with .length.
  `);

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(".CallExpression[callee=.MemberExpression[object IN (/^\\$/ /^jQuery/)][property=size]][arguments.length=0]", () => {
      replace(["callee.property", "arguments"], { with: "length" });
    });
  });
});
