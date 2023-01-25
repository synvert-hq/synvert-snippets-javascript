const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "prefer-number-properties", () => {
  description(`
    Prefer Number properties.

    \`\`\`javascript
    const foo = parseInt('10', 2);
    const foo = parseFloat('10.5');
    const foo = isNaN(10);
    const foo = isFinite(10);
    if (Object.is(foo, NaN)) {}
    const isPositiveZero = value => value === 0 && 1 / value === Infinity;
    const isNegativeZero = value => value === 0 && 1 / value === -Infinity;
    \`\`\`

    =>

    \`\`\`javascript
    const foo = Number.parseInt('10', 2);
    const foo = Number.parseFloat('10.5');
    const foo = Number.isNaN(10);
    const foo = Number.isFinite(10);
    if (Object.is(foo, Number.NaN)) {}
    const isPositiveZero = value => value === 0 && 1 / value === Number.POSITIVE_INFINITY;
    const isNegativeZero = value => value === 0 && 1 / value === Number.NEGATIVE_INFINITY;
    \`\`\`
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });
  withinFiles(Synvert.ALL_FILES, () => {
    findNode(`.CallExpression[expression IN (parseInt parseFloat isNaN isFinite)]`, () => {
      insert("Number.", { at: "beginning" });
    });
  });

  withinFiles(Synvert.ALL_FILES, () => {
    findNode(`.Identifier[escapedText=NaN]`, () => {
      insert("Number.", { at: "beginning" });
    });
  });

  withinFiles(Synvert.ALL_FILES, () => {
    findNode(`.PrefixUnaryExpression[operator=40][operand=Infinity]`, () => {
      replaceWith("Number.NEGATIVE_INFINITY");
    });
  });

  withinFiles(Synvert.ALL_FILES, () => {
    findNode(`.Identifier[escapedText=Infinity]`, () => {
      replaceWith("Number.POSITIVE_INFINITY");
    });
  });
});
