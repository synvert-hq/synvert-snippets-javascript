const snippet = "react/import-prop-types";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  describe("single specifier", () => {
    const input = `
      import React, { PropTypes } from "react";
    `;

    const output = `
      import PropTypes from "prop-types";
      import React from "react";
    `;

    assertConvert({
      input,
      output,
      snippet,
      path: "code.jsx",
      helpers: ["helpers/add-import", "helpers/remove-imports"],
    });
  });

  describe("multiple specifiers", () => {
    const input = `
      import React, { Component, PropTypes } from "react";
    `;

    const output = `
      import PropTypes from "prop-types";
      import React, { Component } from "react";
    `;

    assertConvert({
      input,
      output,
      snippet,
      path: "code.jsx",
      helpers: ["helpers/add-import", "helpers/remove-imports"],
    });
  });
});
