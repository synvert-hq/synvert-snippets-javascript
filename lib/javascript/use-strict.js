const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "useStrict", () => {
  description(`insert 'use strcit' if does not exist`);

  withFiles("**/*.js", () => {
    unlessExistNode({ type: "ExpressionStatement", directive: "use strict" }, () => {
      prepend("'use strict'");
    });
  });
});
