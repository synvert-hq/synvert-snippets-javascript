const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "forbid-use-strict", () => {
  description(`remove 'use strcit' if does not exist`);

  withinFiles(Synvert.ALL_FILES, () => {
    withNode({ type: "ExpressionStatement", directive: "use strict" }, () => {
      remove();
    });
  });
});
