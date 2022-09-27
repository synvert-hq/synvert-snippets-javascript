const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "prefer-string-slice", () => {
  description(`
    foo.substr(start, length);
    foo.substring(indexStart, indexEnd);
    =>
    foo.slice(start, start + length);
    foo.slice(indexStart, indexEnd);
  `);

  configure({ parser: "typescript" });
  withinFiles(Synvert.ALL_JS_FILES, () => {
    findNode(`.CallExpression[expression=.PropertyAccessExpression[name=substr]][arguments.length=2]`, () => {
      replace("arguments.1", { with: "{{arguments.0}} + {{arguments.1}}" });
      replace("expression.name", { with: "slice" });
    });
    findNode(`.CallExpression[expression=.PropertyAccessExpression[name=substring]][arguments.length=2]`, () => {
      replace("expression.name", { with: "slice" });
    });
  });
});
