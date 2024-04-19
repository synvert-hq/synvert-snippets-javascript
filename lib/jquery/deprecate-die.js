new Synvert.Rewriter("jquery", "deprecate-die", () => {
  description(`
    The .die() method has been deprecated since jQuery 1.7 and has been removed in 1.9. We recommend upgrading code to use the .off() method instead.

    To exactly match $("a.foo").die("click"), for example, you can write $(document).off("click", "a.foo").
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  ifNpm("jquery", ">= 1.7");

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression
          [expression=.CallExpression
            [expression IN ($ jQuery)]
            [arguments.length=1]
            [arguments.0=.StringLiteral]]
          [name=die]]
        [arguments.length=1][arguments.0=.StringLiteral]`,
      () => {
        replaceWith("{{expression.expression.expression}}(document).off({{arguments.0}}, {{expression.expression.arguments.0}})");
      }
    );
  });
});
