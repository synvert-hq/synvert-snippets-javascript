const Synvert = require("synvert-core");

new Synvert.Rewriter("jquery", "deprecate-removeattr-boolean-properties", () => {
  configure({ sourceType: 'script' });

  description(`
    JQMIGRATE: jQuery.fn.removeAttr no longer sets boolean properties
    Cause: Prior to jQuery 3.0, using .removeAttr() on a boolean attribute such as checked, selected, or readonly would also set the corresponding named property to false. This behavior was required for ancient versions of Internet Explorer but is not correct for modern browsers because the attribute represents the initial value and the property represents the current (dynamic) value.

    Solution: It is almost always a mistake to use .removeAttr( "checked" ) on a DOM element. The only time it might be useful is if the DOM is later going to be serialized back to an HTML string. In all other cases, .prop( "checked", false ) should be used instead.
  `);

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(`.CallExpression[callee=.MemberExpression[object IN (/^\\$/ /^jQuery/)][property=removeAttr]]
                [arguments.length=1][arguments.0.value IN (checked disabled readonly selected)]`, () => {
      replace("callee.property", { with: "prop" });
      insert(", false", { to: "arguments.0", at: "end" });
    });
  });
});
