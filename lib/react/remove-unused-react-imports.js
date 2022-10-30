const Synvert = require("synvert-core");

new Synvert.Rewriter("react", "remove-unused-react-imports", () => {
  description(`
    import React from 'react';

    function App() {
      return <h1>Hello World</h1>;
    }

    =>

    function App() {
      return <h1>Hello World</h1>;
    }
  `);

  ifNpm("react", ">= 17.0.0");

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    callHelper("helpers/remove-imports", { importNames: ["React"] });
  });
});
