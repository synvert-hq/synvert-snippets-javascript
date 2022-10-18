const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "forbid-use-strict", () => {
  description("remove 'use strcit' if does not exist");

  configure({ parser: "typescript" });

  withinFiles(Synvert.ALL_FILES, () => {
    findNode('.ExpressionStatement[expression.text="use strict"]', function () {
      remove();
    });
  });
});
