const Synvert = require("synvert-core");
const { ALL_FILES } = require("../constants");

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

  withinFiles(ALL_FILES, function () {
    withNode(
      {
        type: "ImportDeclaration",
        specifiers: { length: 1, first: { type: "ImportDefaultSpecifier", local: "React" } },
        source: { value: "react" },
      },
      () => {
        remove();
      }
    );
  });
});
