require("../../lib/react/import-prop-types");
const { assertConvert } = require("../utils");

describe("react/import-prop-types", () => {
  describe("single specifier", () => {
    const input = `
      import React, { PropTypes } from 'react';
    `;

    const output = `
      import React from 'react';
      import PropTypes from 'prop-types';
    `;

    assertConvert({
      input,
      output,
      path: "code.jsx",
      snippet: "react/import-prop-types",
    });
  });

  describe("multiple specifiers", () => {
    const input = `
      import React, { Component, PropTypes } from 'react';
    `;

    const output = `
      import React, { Component } from 'react';
      import PropTypes from 'prop-types';
    `;

    assertConvert({
      input,
      output,
      path: "code.jsx",
      snippet: "react/import-prop-types",
    });
  });
});
