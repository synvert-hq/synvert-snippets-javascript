new Synvert.Rewriter("react", "short-syntax-fragment", () => {
  description(`
    \`\`\`javascript
    import React, { Component, Fragment } from 'react'

    class Button extends Component {
      render() {
        return (
          <Fragment>
          </Fragment>
        )
      }
    }
    \`\`\`

    =>

    \`\`\`javascript
    import React, { Component } from 'react'

    class Button extends Component {
      render() {
        return (
          <>
          </>
        )
      }
    }
    \`\`\`
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, () => {
    callHelper("helpers/remove-imports", { importNames: ["Fragment"] });

    // <Fragment></Fragment>
    // =>
    // <></>
    findNode(".JsxOpeningElement[tagName=Fragment], .JsxClosingElement[tagName=Fragment]", () => {
      // prettier-ignore
      delete("tagName");
    });

    // <React.Fragment></React.Fragment>
    // =>
    // <></>
    findNode(
      `.JsxOpeningElement[tagName=.PropertyAccessExpression[expression=React][name=Fragment]],
        .JsxClosingElement[tagName=.PropertyAccessExpression[expression=React][name=Fragment]]`,
      () => {
        // prettier-ignore
        delete("tagName");
      },
    );
  });
});
