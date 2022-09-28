const Synvert = require("synvert-core");

new Synvert.Rewriter("jquery", "deprecate-bind-and-delegate", () => {
  description(`
    JQMIGRATE: jQuery.fn.bind() is deprecated
    JQMIGRATE: jQuery.fn.unbind() is deprecated
    JQMIGRATE: jQuery.fn.delegate() is deprecated
    JQMIGRATE: jQuery.fn.undelegate() is deprecated
    Cause:: These event binding methods have been deprecated in favor of the .on() and .off() methods which can handle both delegated and direct event binding. Although the older methods are still present in jQuery 3.0, they may be removed as early as the next major-version update.

    Solution: Change the method call to use .on() or .off(), the documentation for the old methods include specific instructions. In general, the .bind() and .unbind() methods can be renamed directly to .on() and .off() respectively since the argument orders are identical.
  `);

  withinFiles(Synvert.ALL_FILES, function () {
    // $(this).bind("click", function () { console.log('bind') });
    // =>
    // $(this).on("click", function () { console.log('bind') });
    findNode(
      ".CallExpression[callee=.MemberExpression[object IN (/^\\$/ /^jQuery/)][property=bind]][arguments.length>=2]",
      () => {
        replace("callee.property", { with: "on" });
      }
    );

    // $(this).unbind("click");
    // =>
    // $(this).off("click");
    findNode(
      ".CallExpression[callee=.MemberExpression[object IN (/^\\$/ /^jQuery/)][property=unbind]][arguments.length>=1]",
      () => {
        replace("callee.property", { with: "off" });
      }
    );

    // $(this).delegate(selector, event, handler);
    // =>
    // $(this).on(event, selector, handler);
    findNode(
      ".CallExpression[callee=.MemberExpression[object IN (/^\\$/ /^jQuery/)][property=delegate]][arguments.length>=3]",
      () => {
        replace("callee.property", { with: "on" });
        replace("arguments.0", { with: "{{arguments.1}}" });
        replace("arguments.1", { with: "{{arguments.0}}" });
      }
    );

    // $(this).undelegate();
    // =>
    // $(this).off();
    findNode(
      ".CallExpression[callee=.MemberExpression[object IN (/^\\$/ /^jQuery/)][property=undelegate]][arguments.length<2]",
      () => {
        replace("callee.property", { with: "off" });
      }
    );

    // $(this).undelegate(selector, event, handler);
    // =>
    // $(this).off(event, selector, handler);
    findNode(
      ".CallExpression[callee=.MemberExpression[object IN (/^\\$/ /^jQuery/)][property=undelegate]][arguments.length>=2]",
      () => {
        replace("callee.property", { with: "off" });
        replace("arguments.0", { with: "{{arguments.1}}" });
        replace("arguments.1", { with: "{{arguments.0}}" });
      }
    );
  });
});
