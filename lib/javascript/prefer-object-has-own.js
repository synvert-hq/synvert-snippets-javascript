const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "preferObjectHasOwn", () => {
  description(`
    After V8 release v9.3

    Object.prototype.hasOwnProperty.call({ prop: 42 }, 'prop')
    =>
    Object.hasOwn({ prop: 42 }, 'prop')
  `);

  withFiles("**/*.js", () => {
    withNode(
      {
        type: "CallExpression",
        callee: {
          type: "MemberExpression",
          object: {
            type: "MemberExpression",
            object: { type: "MemberExpression", object: "Object", property: "prototype" },
            property: "hasOwnProperty",
          },
          property: "call",
        },
        arguments: { length: 2 },
      },
      () => {
        replace("callee", { with: "Object.hasOwn" });
      }
    );
  });
});
