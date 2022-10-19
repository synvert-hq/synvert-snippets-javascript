const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "use-strict", () => {
  description(`insert 'use strcit' if does not exist`);

  configure({ parser: "typescript" });

  withinFiles(Synvert.ALL_FILES, () => {
    unlessExistNode('.ExpressionStatement[expression.text="use strict"]', () => {
      insert("'use strict'\n", { at: "beginning" });
    });
  });
});
