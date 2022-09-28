const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "use-strict", () => {
  description(`insert 'use strcit' if does not exist`);

  withinFiles(Synvert.ALL_FILES, () => {
    findNode(":not_has(> .ExpressionStatement[directive='use strict'])", () => {
      insert("'use strict'\n", { at: "beginning" });
    });
  });
});
