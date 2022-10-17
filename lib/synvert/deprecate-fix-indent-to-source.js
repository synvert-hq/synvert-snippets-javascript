const Synvert = require("synvert-core");

new Synvert.Rewriter("synvert", "deprecate-fix-indent-to-source", () => {
  description("Deprecate `fixIndentToSource`, use `toSource({ fixIndent: true })` instead.");

  configure({ parser: "typescript" });

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(".CallExpression[expression=.PropertyAccessExpression[name=fixIndentToSource]]", () => {
      replace("expression.name", { with: "toSource" });
      insert("{ fixIndent: true }", { to: "arguments.0" });
    });
  });
});
