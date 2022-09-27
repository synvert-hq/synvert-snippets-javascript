const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "prefer-regexp-test", () => {
  description(`
    string.match(/unicorn/)
    /unicorn/.exec(string)
    =>
    /unicorn/.test(string)
    /unicorn/.test(string)
  `);

  configure({ parser: "typescript" });
  withinFiles(Synvert.ALL_JS_FILES, () => {
    findNode(`.CallExpression[expression=.PropertyAccessExpression[name=match]][arguments.0=.RegularExpressionLiteral][arguments.length=1]`, () => {
      replaceWith("{{arguments.0}}.test({{expression.expression}})");
    });

    findNode(`.CallExpression[expression=.PropertyAccessExpression[expression=.RegularExpressionLiteral][name=exec]][arguments.length=1]`, () => {
      replace("expression.name", { with: "test" });
    });
  });
});
