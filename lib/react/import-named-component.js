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

  withinFiles(Synvert.ALL_JS_FILES, function () {
    findNode(":has(.ClassDeclaration[superClass=.MemberExpression[object=React][property=Component]])", () => {
      // import React from 'react'
      // =>
      // import React, { Component } from 'react'
      findNode(".ImportDeclaration[source.value=react][specifiers.length=1][specifiers.first=.ImportDefaultSpecifier[local=React]]", () => {
        insert(", { Component }", { to: "specifiers.first", at: "end" });
      });

      // import React, { Fragment } from 'react'
      // =>
      // import React, { Fragment, Component } from 'react'
      findNode(".ImportDeclaration[source.value=react][specifiers.length!=1]", () => {
        insert(", Component", { to: "specifiers.last", at: "end" });
      });

      // class Button extends React.Component {}
      // =>
      // class Button extends Component {}
      findNode(".ClassDeclaration[superClass=.MemberExpression[object=React][property=Component]]", () => {
        deleteNode(["superClass.object", "superClass.dot"]);
      });
    });
  });
});
