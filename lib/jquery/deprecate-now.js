new Synvert.Rewriter("jquery", "deprecate-now", () => {
  description(`
    \`\`\`javascript
    jQuery.now()
    \`\`\`

    =>

    \`\`\`javascript
    Date.now()
    \`\`\`
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  ifNpm("jquery", ">= 3.3");

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(
      `.CallExpression[expression=.PropertyAccessExpression[expression IN ($ jQuery)][name=now]][arguments.length=0]`,
      () => {
        replace("expression.expression", { with: "Date" });
      },
    );
  });
});
