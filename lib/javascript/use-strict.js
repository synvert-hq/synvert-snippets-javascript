const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "use-strict", () => {
  description(`insert 'use strcit' if does not exist`);

  withinFiles(Synvert.ALL_FILES, () => {
    unlessExistNode({ type: "ExpressionStatement", directive: "use strict" }, () => {
      prepend("'use strict'");
    });
  });
});
