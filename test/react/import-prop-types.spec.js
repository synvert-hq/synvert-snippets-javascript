const snippet = "react/import-prop-types";
const { assertConvert } = require("../utils");

describe(snippet, () => {
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
      snippet,
      path: "code.jsx",
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
      snippet,
      path: "code.jsx",
    });
  });
});
