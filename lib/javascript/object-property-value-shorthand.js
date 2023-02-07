new Synvert.Rewriter("javascript", "object-property-value-shorthand", () => {
  description(`
    Use shorthand object property value.

    \`\`\`javascript
    const someObject = {
      cat: cat,
      dog: dog,
      bird: bird
    }
    \`\`\`

    =>

    \`\`\`javascript
    const someObject = {
      cat,
      dog,
      bird
    }
    \`\`\`
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(`.PropertyAssignment[name=.Identifier][initializer=.Identifier][key="{{value}}"]`, () => {
      deleteNode(["semicolon", "initializer"]);
    });
  });
});
