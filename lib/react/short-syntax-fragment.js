const Synvert = require("synvert-core");

new Synvert.Rewriter("react", "short-syntax-fragment", () => {
  description(`
    import React, { Component, Fragment } from 'react'

    class Button extends Component {
      render() {
        return (
          <Fragment>
          </Fragment>
        )
      }
    }
    =>
    import React, { Component } from 'react'

    class Button extends Component {
      render() {
        return (
          <>
          </>
        )
      }
    }
  `);

  configure({ parser: "typescript" });

  withinFiles(Synvert.ALL_FILES, function () {
    // import React, { Component, Fragment } from 'react'
    // =>
    // import React, { Component } from 'react'
    findNode(
      `.ImportDeclaration[moduleSpecifier.text="react"][importClause=.ImportClause[namedBindings=.NamedImports[elements.length>1]]] .ImportSpecifier[name=Fragment]`,
      () => {
        remove();
      }
    );

    // import React, { Fragment } from 'react'
    // =>
    // import React from 'react'
    findNode(
      `.ImportDeclaration[moduleSpecifier.text="react"][importClause=.ImportClause[namedBindings=.NamedImports[elements.length=1][elements.0.name=Fragment]]]`,
      () => {
        deleteNode("importClause.namedBindings");
      }
    );

    // <Fragment></Fragment>
    // =>
    // <></>
    findNode(".JsxOpeningElement[tagName=Fragment], .JsxClosingElement[tagName=Fragment]", () => {
      deleteNode("tagName");
    });

    // <React.Fragment></React.Fragment>
    // =>
    // <></>
    findNode(
      `.JsxOpeningElement[tagName=.PropertyAccessExpression[expression=React][name=Fragment]],
        .JsxClosingElement[tagName=.PropertyAccessExpression[expression=React][name=Fragment]]`,
      () => {
        deleteNode("tagName");
      }
    );
  });
});
