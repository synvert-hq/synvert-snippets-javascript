const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "prefer-negative-index", () => {
  description(`
    foo.slice(foo.length - 2, foo.length - 1);
    foo.splice(foo.length - 1, 1);
    foo.at(foo.length - 1);
    =>
    foo.slice(-2, -1);
    foo.splice(-1, 1);
    foo.at(-1);
  `);

  configure({ parser: "typescript" });
  withinFiles(Synvert.ALL_FILES, () => {
    findNode(
      `.CallExpression[expression=.PropertyAccessExpression[expression=.Identifier][name IN (slice splice)]][arguments.1=.BinaryExpression[left=.PropertyAccessExpression[expression="{{expression.expression}}"][name=length]][operatorToken=.MinusToken][right=.FirstLiteralToken]][arguments.length=2]`,
      () => {
        replace("arguments.1", { with: "-{{arguments.1.right}}" });
      }
    );

    findNode(
      `.CallExpression[expression=.PropertyAccessExpression[expression=.Identifier][name IN (slice splice)]][arguments.0=.BinaryExpression[left=.PropertyAccessExpression[expression="{{expression.expression}}"][name=length]][operatorToken=.MinusToken][right=.FirstLiteralToken]][arguments.length=2]`,
      () => {
        replace("arguments.0", { with: "-{{arguments.0.right}}" });
      }
    );

    findNode(
      `.CallExpression[expression=.PropertyAccessExpression[expression=.Identifier][name=at]][arguments.0=.BinaryExpression[left=.PropertyAccessExpression[expression="{{expression.expression}}"][name=length]][operatorToken=.MinusToken][right=.FirstLiteralToken]][arguments.length=1]`,
      () => {
        replaceWith("{{expression}}(-{{arguments.0.right}})");
      }
    );
  });
});