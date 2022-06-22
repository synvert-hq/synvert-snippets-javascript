const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "forbid-use-strict", () => {
  description("remove 'use strcit' if does not exist");

  withinFiles(Synvert.ALL_JS_FILES, () => {
    findNode('.ExpressionStatement[directive="use strict"]', function () {
      remove();
    });
  });
});
