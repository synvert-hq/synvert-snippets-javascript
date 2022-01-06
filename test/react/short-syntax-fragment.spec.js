require("../../lib/react/short-syntax-fragment");
const { assertConvert } = require("../utils");

describe("react/short-syntax-fragment", () => {
  describe("import default", () => {
    const input = `
      import React, { Fragment } from 'react';

      class Button extends React.Component {
        render() {
          return (
            <Fragment>
            </Fragment>
          )
        }
      }
    `;

    const output = `
      import React from 'react';

      class Button extends React.Component {
        render() {
          return (
            <>
            </>
          )
        }
      }
    `;

    assertConvert({
      input,
      output,
      path: "code.jsx",
      snippet: "react/short-syntax-fragment",
    });
  });

  describe("import with", () => {
    const input = `
      import React, { Fragment, Component } from 'react';

      class Button extends Component {
        render() {
          return (
            <Fragment>
            </Fragment>
          )
        }
      }
    `;

    const output = `
      import React, { Component } from 'react';

      class Button extends Component {
        render() {
          return (
            <>
            </>
          )
        }
      }
    `;

    assertConvert({
      input,
      output,
      path: "code.jsx",
      snippet: "react/short-syntax-fragment",
    });
  });
});
