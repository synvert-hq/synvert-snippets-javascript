const Synvert = require("synvert-core");

new Synvert.Rewriter("react", "import-named-component", () => {
  description(`
    import React from 'react'

    class Button extends React.Component {
    }
    =>
    import React, { Component } from 'react'

    class Button extends Component {
    }
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    // class Button extends React.Component {}
    // =>
    // class Button extends Component {}
    findNode(".HeritageClause .PropertyAccessExpression[expression=React][name=Component]", () => {
      deleteNode(["expression", "dot"]);
    });

    // import React from 'react'
    // =>
    // import React, { Component } from 'react'
    findNode(
      `.ImportDeclaration[moduleSpecifier.text=react][importClause.name=React][importClause.namedBindings=undefined]`,
      () => {
        insert(", { Component }", { to: "importClause.name", at: "end" });
      }
    );

    // import React, { Fragment } from 'react'
    // =>
    // import React, { Fragment, Component } from 'react'
    findNode(
      `.ImportDeclaration[moduleSpecifier.text=react][importClause.name=React][importClause.namedBindings!=undefined]`,
      () => {
        insert(", Component", { to: "importClause.namedBindings.elements.0", at: "end" });
      }
    );
  });
});
