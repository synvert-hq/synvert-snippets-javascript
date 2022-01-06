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
    withNode({ type: "ImportDeclaration", source: { value: "react" }, specifiers: { length: { gt: 2 } } }, () => {
      withNode({ type: "ImportSpecifier", local: "Fragment" }, () => {
        remove();
      });
    });

    // import React, { Fragment } from 'react'
    // =>
    // import React from 'react'
    withNode({ type: "ImportDeclaration", source: { value: "react" }, specifiers: { length: 2, first: { type: "ImportDefaultSpecifier", local: "React" }, last: { type: "ImportSpecifier", local: "Fragment" } } }, () => {
      deleteNode('specifiers.1');
    });

    // <Fragment></Fragment>
    // =>
    // <></>
    withNode({ type: { in: ["JSXOpeningElement", "JSXClosingElement" ] }, name: { type: "JSXIdentifier", name: "Fragment" } }, () => {
      deleteNode("name");
    });

    // <React.Fragment></React.Fragment>
    // =>
    // <></>
    withNode({ type: { in: ["JSXOpeningElement", "JSXClosingElement" ] }, name: { type: "JSXMemberExpression", object: "React", property: "Fragment" } }, () => {
      deleteNode("name");
    });
  });
});
