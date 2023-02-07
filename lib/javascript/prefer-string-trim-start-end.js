new Synvert.Rewriter("javascript", "prefer-string-trim-start-end", () => {
  description(`
    Prefer string trimStart and trimEnd methods.

    \`\`\`javascript
    const foo1 = bar.trimLeft();
    const foo2 = bar.trimRight();
    \`\`\`

    =>

    \`\`\`javascript
    const foo1 = bar.trimStart();
    const foo2 = bar.trimEnd();
    \`\`\`
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, () => {
    findNode(".CallExpression[expression=.PropertyAccessExpression[name=trimLeft]][arguments.length=0]", () => {
      replace("expression.name", { with: "trimStart" });
    });
    findNode(".CallExpression[expression=.PropertyAccessExpression[name=trimRight]][arguments.length=0]", () => {
      replace("expression.name", { with: "trimEnd" });
    });
  });
});
