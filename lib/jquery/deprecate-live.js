new Synvert.Rewriter("jquery", "deprecate-live", () => {
  description(`
    The .live() method has been deprecated since jQuery 1.7 and has been removed in 1.9.  We recommend upgrading code to use the .on() method instead.

    To exactly match $("a.foo").live("click", fn), for example, you can write $(document).on("click", "a.foo", fn).
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  ifNpm("jquery", ">= 1.7")

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression
          [expression=.CallExpression
            [expression IN ($ jQuery)]
            [arguments.length=1]
            [arguments.0=.StringLiteral]]
          [name=live]]
        [arguments.length=2][arguments.0=.StringLiteral]`,
      () => {
        replaceWith("{{expression.expression.expression}}(document).on({{arguments.0}}, {{expression.expression.arguments.0}}, {{arguments.1}})");
      }
    );
  });
});
