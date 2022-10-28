const Synvert = require("synvert-core");

new Synvert.Rewriter("jquery", "quote-attribute-selector-with-number-sign", () => {
  description(`
    JQMIGRATE: Attribute selector with '#' must be quoted
    JQMIGRATE: Attribute selector with '#' was not fixed
    Cause: Selectors such as a[href=#main] are not valid CSS syntax because the value contains special characters that are not quoted. Until jQuery 1.11.3/2.1.4 this was accepted, but the behavior is non-standard and was never documented. In later versions this selector throws an error. In some cases with complex selectors, Migrate may not attempt a repair. In those cases a fatal error will be logged on the console and you will need to fix the selector manually.

    Solution: Put quotes around any attribute values that have special characters, e.g. a[href="#main"]. The warning message contains the selector that caused the problem, use that to find the selector in the source files.
  `);

  configure({ parser: Synvert.Parser.ESPREE });

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(
      `.CallExpression[callee IN ($ jQuery)][arguments.length=1][arguments.0=.Literal][arguments.0=~/=\*/]`,
      () => {
        const selector = this.currentNode.arguments[0].raw;
        const isSingleQuote = selector[0] === "'";
        const insertion = isSingleQuote ? '"' : "'";
        replace("arguments.0", { with: selector.replace("=#", `=${insertion}#`).replace("]", `${insertion}]`) });
      }
    );
  });
});
