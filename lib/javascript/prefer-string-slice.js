new Synvert.Rewriter("javascript", "prefer-string-slice", () => {
  description(`
    Prefer string slice method.

    \`\`\`javascript
    foo.substr(start, length);
    foo.substring(indexStart, indexEnd);
    \`\`\`

    =>

    \`\`\`javascript
    foo.slice(start, start + length);
    foo.slice(indexStart, indexEnd);
    \`\`\`
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });
  withinFiles(Synvert.ALL_FILES, () => {
    findNode(`.CallExpression[expression=.PropertyAccessExpression[name=substr]][arguments.length=2]`, () => {
      replace("arguments.1", { with: "{{arguments.0}} + {{arguments.1}}" });
      replace("expression.name", { with: "slice" });
    });
    findNode(`.CallExpression[expression=.PropertyAccessExpression[name=substring]][arguments.length=2]`, () => {
      replace("expression.name", { with: "slice" });
    });
  });
});
