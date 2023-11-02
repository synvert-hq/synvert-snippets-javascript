new Synvert.Rewriter("javascript", "prefer-object-has-own", () => {
  description(`
    Prefer Object.hasOwn after V8 release v9.3.

    \`\`\`javascript
    Object.prototype.hasOwnProperty.call({ prop: 42 }, 'prop')
    \`\`\`

    =>

    \`\`\`javascript
    Object.hasOwn({ prop: 42 }, 'prop')
    \`\`\`
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, () => {
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression
          [expression=.PropertyAccessExpression
            [expression=.PropertyAccessExpression[name=prototype]]
            [name=hasOwnProperty]]
          [name=call]]
        [arguments.length=2]`,
      () => {
        replace("expression", { with: "{{expression.expression.expression.expression}}.hasOwn" });
      },
    );
  });
});
