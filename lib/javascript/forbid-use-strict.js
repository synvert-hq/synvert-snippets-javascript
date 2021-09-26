const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "forbid-use-strict", () => {
  description(`remove 'use strcit' if does not exist`);

  withFiles("**/*.js", () => {
    withNode({ type: "ExpressionStatement", directive: "use strict" }, () => {
      remove();
    });
  });
});
