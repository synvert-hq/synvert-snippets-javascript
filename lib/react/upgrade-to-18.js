new Synvert.Rewriter("react", "upgrade-to-18", () => {
  description(`
    Upgrade react to 18.

    \`\`\`javascript
    const container = document.getElementById('root');
    ReactDOM.render(<App />, container);
    \`\`\`

    =>

    \`\`\`javascript
    const container = document.getElementById('root');
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
    \`\`\`
  `);

  ifNpm("react", ">= 18.0");

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(
      ".CallExpression[expression=.PropertyAccessExpression[expression=ReactDOM][name=render]][arguments.length=2]",
      () => {
        replaceWith("const root = ReactDOM.createRoot({{arguments.1}});");
        insert("\n" + indent("root.render({{arguments.0}})", this.mutationAdapter.getIndent(this.currentNode)), {
          at: "end",
        });
      }
    );
  });
});
