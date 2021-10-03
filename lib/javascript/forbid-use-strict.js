const Synvert = require("synvert-core");
const { ALL_FILES } = require("../constants");

new Synvert.Rewriter("javascript", "forbid-use-strict", () => {
  description(`remove 'use strcit' if does not exist`);

  withinFiles(ALL_FILES, () => {
    withNode({ type: "ExpressionStatement", directive: "use strict" }, () => {
      remove();
    });
  });
});
