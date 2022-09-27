const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "prefer-string-starts-ends-with", () => {
  description(`
    const foo = /^bar/.test(baz);
    const foo = /bar$/.test(baz);
    =>
    const foo = baz.startsWith('bar');
    const foo = baz.endsWith('bar');
  `);

  configure({ parser: "typescript" });
  withinFiles(Synvert.ALL_JS_FILES, () => {
    findNode(
      `.CallExpression[expression=.PropertyAccessExpression[expression=.RegularExpressionLiteral[text^='/^']][name=test]][arguments.length=1]`,
      () => {
        replaceWith(`{{arguments.0}}.startsWith("{{expression.expression.text.slice(2, -1)}}")`);
      }
    );

    findNode(
      `.CallExpression[expression=.PropertyAccessExpression[expression=.RegularExpressionLiteral[text$='$/']][name=test]][arguments.length=1]`,
      () => {
        replaceWith(`{{arguments.0}}.endsWith("{{expression.expression.text.slice(1, -2)}}")`);
      }
    );
  });
});
