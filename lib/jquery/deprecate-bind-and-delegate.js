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
    withNode(
      {
        type: "CallExpression",
        callee: { type: "MemberExpression", object: /^\$/, property: "bind" },
        arguments: { length: { gte: 2 } },
      },
      () => {
        replace("callee.property", { with: "on" });
      }
    );

    withNode(
      {
        type: "CallExpression",
        callee: { type: "MemberExpression", object: /^\$/, property: "unbind" },
        arguments: { length: { gte: 1 } },
      },
      () => {
        replace("callee.property", { with: "off" });
      }
    );

    withNode(
      {
        type: "CallExpression",
        callee: { type: "MemberExpression", object: /^\$/, property: "delegate" },
        arguments: { length: { gte: 3 } },
      },
      () => {
        replace("callee.property", { with: "on" });
        replace("arguments.0", { with: "{{arguments.1}}" });
        replace("arguments.1", { with: "{{arguments.0}}" });
      }
    );

    withNode(
      {
        type: "CallExpression",
        callee: { type: "MemberExpression", object: /^\$/, property: "undelegate" },
        arguments: { length: { lt: 2 } },
      },
      () => {
        replace("callee.property", { with: "off" });
      }
    );

    withNode(
      {
        type: "CallExpression",
        callee: { type: "MemberExpression", object: /^\$/, property: "undelegate" },
        arguments: { length: { gte: 2 } },
      },
      () => {
        replace("callee.property", { with: "off" });
        replace("arguments.0", { with: "{{arguments.1}}" });
        replace("arguments.1", { with: "{{arguments.0}}" });
      }
    );
  });
});
