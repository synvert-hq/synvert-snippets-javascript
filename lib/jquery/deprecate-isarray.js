const Synvert = require("synvert-core");

new Synvert.Rewriter("jquery", "deprecate-isarray", () => {
  description(`
    JQMIGRATE: jQuery.isArray is deprecated; use Array.isArray
    Cause: Older versions of JavaScript made it difficult to determine if a particular object was a true Array, so jQuery provided a cross-browser function to do the work. The browsers supported by jQuery 3.0 all provide a standard method for this purpose.

    Solution: Replace any calls to jQuery.isArray with Array.isArray.
  `);

  withinFiles(Synvert.ALL_JS_FILES, function () {
    findNode(".CallExpression[callee=.MemberExpression[object IN ($ jQuery)][property=isArray]]", () => {
      replace("callee.object", { with: "Array" });
    });
  });
});
