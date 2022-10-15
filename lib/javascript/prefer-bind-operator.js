const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "prefer-bind-operator", () => {
  description(`
    let x = this.foo.bind(this);
    =>
    let x = ::this.foo;
  `);

  configure({ parser: "espree" });

  withinFiles(Synvert.ALL_FILES, () => {
    findNode(
      `.CallExpression
                [callee=.MemberExpression
                  [object=.MemberExpression
                    [object=this]]
                  [property=bind]]
                [arguments.length=1]
                [arguments.0=this]`,
      () => {
        insert("::", { at: "beginning" });
        deleteNode(["callee.dot", "callee.property", "arguments"]);
      }
    );
  });
});
