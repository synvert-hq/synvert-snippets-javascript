const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "prefer-string-slice", () => {
  description(`
    foo.substr(start, length);
    foo.substring(indexStart, indexEnd);
    =>
    foo.slice(start, start + length);
    foo.slice(indexStart, indexEnd);
  `);

  configure({ parser: 'typescript' });
  withinFiles(Synvert.ALL_JS_FILES, () => {
    findNode(`.CallExpression[expression=.PropertyAccessExpression[expression=.Identifier][name=substr]][arguments.0=.Identifier][arguments.1=.Identifier][arguments.length=2]`, () => {
      replace("arguments.1", { with: "{{arguments.0}} + {{arguments.1}}" });
      replace("expression.name", { with: "slice" });
    });
    findNode(`.CallExpression[expression=.PropertyAccessExpression[expression=.Identifier][name=substring]][arguments.0=.Identifier][arguments.1=.Identifier][arguments.length=2]`, () => {
      replace("expression.name", { with: "slice" });
    });
  });
});
