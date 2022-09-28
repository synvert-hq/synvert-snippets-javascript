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

  withinFiles(Synvert.ALL_FILES, function () {
    // import React, { Component, Fragment } from 'react'
    // =>
    // import React, { Component } from 'react'
    findNode(".ImportDeclaration[source.value=react][specifiers.legnth>2] .ImportSpecifier[local=Fragment]", () => {
      remove();
    });

    // import React, { Fragment } from 'react'
    // =>
    // import React from 'react'
    findNode(
      `.ImportDeclaration[source.value=react][specifiers.length=2]
                [specifiers.first=.ImportDefaultSpecifier[local=React]]
                [specifiers.last=.ImportSpecifier[local=Fragment]]`,
      () => {
        deleteNode("specifiers.1");
      }
    );

    // <Fragment></Fragment>
    // =>
    // <></>
    findNode(".JSXOpeningElement[name=Fragment], .JSXClosingElement[name=Fragment]", () => {
      deleteNode("name");
    });

    // <React.Fragment></React.Fragment>
    // =>
    // <></>
    findNode(
      `.JSXOpeningElement[name=.JSXMemberExpression[object=React][property=Fragment]],
                .JSXClosingElement[name=.JSXMemberExpression[object=React][property=Fragment]]`,
      () => {
        deleteNode("name");
      }
    );
  });
});
