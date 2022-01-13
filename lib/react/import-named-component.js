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

  withinFiles(Synvert.ALL_FILES, function () {
    ifExistNode({ type: "ClassDeclaration", superClass: { type: "MemberExpression", object: "React", property: "Component" } }, () => {
      // import React from 'react'
      // =>
      // import React, { Component } from 'react'
      withNode({ type: "ImportDeclaration", source: { value: "react" }, specifiers: { length: 1, first: { type: "ImportDefaultSpecifier", local: "React" } } }, () => {
        insert(', { Component }', { to: 'specifiers.first', at: 'end' });
      });

      // import React, { Fragment } from 'react'
      // =>
      // import React, { Fragment, Component } from 'react'
      withNode({ type: "ImportDeclaration", source: { value: "react" }, specifiers: { length: { not: 1 } } }, () => {
        insert(', Component', { to: 'specifiers.last', at: 'end' });
      });

      // class Button extends React.Component {}
      // =>
      // class Button extends Component {}
      withNode({ type: "ClassDeclaration", superClass: { type: "MemberExpression", object: "React", property: "Component" } }, () => {
        deleteNode(['superClass.object', 'superClass.dot']);
      });
    });
  });
});
