new Synvert.Rewriter("javascript", "prefer-bind-operator", () => {
  description(`
    Prefer bind operator.

    \`\`\`javascript
    let x = this.foo.bind(this);
    \`\`\`

    =>

    \`\`\`javascript
    let x = ::this.foo;
    \`\`\`
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
        group(() => {
          insert("::", { at: "beginning" });
          // prettier-ignore
          delete(["expression.dot", "expression.name", "arguments"]);
        });
      },
    );
  });
});
