const Synvert = require("synvert-core");
const { ALL_FILES } = require("../constants");

new Synvert.Rewriter("javascript", "use-strict", () => {
  description(`insert 'use strcit' if does not exist`);

  withinFiles(ALL_FILES, () => {
    unlessExistNode({ type: "ExpressionStatement", directive: "use strict" }, () => {
      prepend("'use strict'");
    });
  });
});
