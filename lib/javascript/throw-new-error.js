const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "throw-new-error", () => {
  description("While it's possible to create a new error without using the new keyword, it's better to be explicit.");

  configure({ parser: Synvert.Parser.TYPESCRIPT });
  withinFiles(Synvert.ALL_FILES, () => {
    findNode(".ThrowStatement[expression!=.NewExpression]", function () {
      insert("new ", { at: "beginning", to: "expression" });
    });
  });
});
