const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "forbidUseStrict", () => {
  description(`remove 'use strcit' if does not exist`);

  withFiles("**/*.js", () => {
    withNode({ type: "ExpressionStatement", directive: "use strict" }, () => {
      remove();
    });
  });
});
