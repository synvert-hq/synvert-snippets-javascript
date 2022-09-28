const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "prefer-spread", () => {
  description(`
    Array.from(set)
    array1.concat(array2)
    string.split('')
    =>
    [...set]
    [...array1, ...array2]
    [...string]
  `);

  configure({ parser: "typescript" });
  withinFiles(Synvert.ALL_FILES, () => {
    findNode(
      `.CallExpression[expression=.PropertyAccessExpression[expression=Array][name=from]][arguments.length=1]`,
      () => {
        replaceWith("[...{{arguments.0}}]");
      }
    );

    findNode(`.CallExpression[expression=.PropertyAccessExpression[name=concat]][arguments.length=1]`, () => {
      replaceWith("[...{{expression.expression}}, ...{{arguments.0}}]");
    });

    findNode(
      `.CallExpression[expression=.PropertyAccessExpression[expression=.Identifier][name=split]][arguments.0=.StringLiteral[text=""]][arguments.length=1]`,
      () => {
        replaceWith("[...{{expression.expression}}]");
      }
    );
  });
});
