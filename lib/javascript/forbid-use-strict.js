const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "forbid-use-strict", () => {
  description("remove 'use strcit' if does not exist");

  configure({ parser: "espree" });

  withinFiles(Synvert.ALL_FILES, () => {
    findNode('.ExpressionStatement[directive="use strict"]', function () {
      remove();
    });
  });
});
