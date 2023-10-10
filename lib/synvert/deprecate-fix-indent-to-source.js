new Synvert.Rewriter("synvert", "deprecate-fix-indent-to-source", () => {
  description("Deprecate `fixIndentToSource`, use `toSource({ fixIndent: true })` instead.");

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(".CallExpression[expression=.PropertyAccessExpression[name=fixIndentToSource]]", () => {
      group(() => {
        replace("expression.name", { with: "toSource" });
        insert("{ fixIndent: true }", { to: "arguments.0" });
      });
    });
  });
});
