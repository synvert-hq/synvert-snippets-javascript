const Synvert = require("synvert-core");

new Synvert.Rewriter("react", "removeUnusedReactImports", () => {
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

  withFiles("**/*.{js,jsx}", function () {
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
