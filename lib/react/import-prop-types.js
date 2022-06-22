const Synvert = require("synvert-core");

new Synvert.Rewriter("react", "import-prop-types", () => {
  description(`
    import React, { Component, PropTypes } from 'react'
    =>
    import React, { Component } from 'react'
    import PropTypes from 'prop-types'
  `);

  withinFiles(Synvert.ALL_JS_FILES, function () {
    findNode(".ImportDeclaration[source.value=react]", () => {
      let containPropTypes = false;
      findNode(".ImportSpecifier[imported=PropTypes]", () => {
        containPropTypes = true;
        remove();
      });
      if (containPropTypes) {
        insert(`\n${" ".repeat(this.currentNode.loc.start.column)}import PropTypes from 'prop-types';`, { at: "end" });
      }
    });
  });
});
