require("../../lib/react/import-named-component");
const { assertConvert } = require("../utils");

describe("react/import-named-component", () => {
  describe("import default", () => {
    const input = `
      import React from 'react';

      class Button extends React.Component {
      }
    `;

    const output = `
      import React, { Component } from 'react';

      class Button extends Component {
      }
    `;

    assertConvert({
      input,
      output,
      path: "code.jsx",
      snippet: "react/import-named-component",
    });
  });

  describe("import with", () => {
    const input = `
      import React, { Fragment } from 'react';

      class Button extends React.Component {
      }
    `;

    const output = `
      import React, { Fragment, Component } from 'react';

      class Button extends Component {
      }
    `;

    assertConvert({
      input,
      output,
      path: "code.jsx",
      snippet: "react/import-named-component",
    });
  });
});
