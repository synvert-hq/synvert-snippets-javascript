new Synvert.Rewriter("javascript", "trailing-comma", () => {
  description(`
    Add trailing comma.

    \`\`\`javascript
    const object = {
      hello: 'hello',
      allo: 'allo',
      hola: 'hola'
    };

    const array = [
      'hello',
      'allo',
      'hola'
    ];
    \`\`\`

    =>

    \`\`\`javascript
    const object = {
      hello: 'hello',
      allo: 'allo',
      hola: 'hola',
    };

    const array = [
      'hello',
      'allo',
      'hola',
    ];
    \`\`\`
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, () => {
    findNode(`.ObjectLiteralExpression[multiLine=true][properties.hasTrailingComma=false]`, function () {
      insert(",", { to: "properties.-1", at: "end" });
    });
    findNode(`.ArrayLiteralExpression[multiLine=true][elements.hasTrailingComma=false]`, function () {
      insert(",", { to: "elements.-1", at: "end" });
    });
  });
});
