const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "use-strict", () => {
  description(`insert 'use strcit' if does not exist`);

  withinFiles("**/*.js", () => {
    unlessExistNode({ type: "ExpressionStatement", directive: "use strict" }, () => {
      prepend("'use strict'");
    });
  });
});
