const Synvert = require("synvert-core");

new Synvert.Rewriter("react", "upgrade-to-18", () => {
  description(`
    Upgrade react to 18.

    const container = document.getElementById('root');
    ReactDOM.render(<App />, container);
    =>
    const container = document.getElementById('root');
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
  `);

  ifNpm("react", ">= 18.0");

  withinFiles(Synvert.ALL_JS_FILES, function () {
    findNode(".CallExpression[callee=.MemberExpression[object=ReactDOM][property=render]][arguments.length=2]", () => {
      replaceWith("const root = ReactDOM.createRoot({{arguments.1}});");
      insert("\n" + indent("root.render({{arguments.0}})", this.currentNode.loc.start.column), { at: "end" });
    });
  });
});
