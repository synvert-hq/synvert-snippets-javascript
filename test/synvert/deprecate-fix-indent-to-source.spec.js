const snippet = "synvert/deprecate-fix-indent-to-source";
require(`../../lib/${snippet}`);
const { assertConvert } = require("../utils");

describe(snippet, () => {
  const input = `
    new Synvert.Rewriter("synvert", "deprecate-fix-indent-to-source", () => {
      withinFiles(Synvert.ALL_JS_FILES, function () {
        this.currentNode.fixIndentToSource()
      });
    });
  `;

  const output = `
    new Synvert.Rewriter("synvert", "deprecate-fix-indent-to-source", () => {
      withinFiles(Synvert.ALL_JS_FILES, function () {
        this.currentNode.toSource({ fixIndent: true })
      });
    });
  `;

  assertConvert({
    input,
    output,
    snippet,
  });
});
