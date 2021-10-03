const Synvert = require("synvert-core");
const { ALL_FILES } = require("../constants");

new Synvert.Rewriter("javascript", "prefer-bind-operator", () => {
  description(`
    let x = this.foo.bind(this);
    =>
    let x = ::this.foo;
  `);

  withinFiles(ALL_FILES, () => {
    withNode(
      {
        type: "CallExpression",
        callee: { type: "MemberExpression", object: { type: "MemberExpression", object: "this" }, property: "bind" },
        arguments: { length: 1, 0: "this" },
      },
      () => {
        insert("::", { at: "beginning" });
        deleteNode(["callee.dot", "callee.property", "arguments"]);
      }
    );
  });
});
