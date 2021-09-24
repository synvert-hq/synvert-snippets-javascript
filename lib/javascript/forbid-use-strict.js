const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "forbidUseStrict", () => {
  description(`remove 'use strcit' if does not exist`);

  withFiles("**/*.js", () => {
    withNode({ type: "Literal", value: "use strict" }, () => {
      remove();
    });
  });
});
