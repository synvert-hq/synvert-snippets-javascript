const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "prefer-bind-operator", () => {
  description(`
    let x = this.foo.bind(this);
    =>
    let x = ::this.foo;
  `);

  // typescript does not support :: yet
  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, () => {
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression
          [expression=.PropertyAccessExpression
            [expression=this]]
          [name=bind]]
        [arguments.length=1]
        [arguments.0=this]`,
      () => {
        insert("::", { at: "beginning" });
        deleteNode(["expression.dot", "expression.name", "arguments"]);
      }
    );
  });
});
