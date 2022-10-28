const Synvert = require("synvert-core");

new Synvert.Rewriter("react", "import-prop-types", () => {
  description(`
    import React, { Component, PropTypes } from 'react'
    =>
    import React, { Component } from 'react'
    import PropTypes from 'prop-types'
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    findNode('.ImportDeclaration[moduleSpecifier.text="react"]', () => {
      let containPropTypes = false;
      findNode(".ImportSpecifier[name=PropTypes]", () => {
        containPropTypes = true;
        remove();
      });
      if (containPropTypes) {
        insertAfter("import PropTypes from 'prop-types';");
      }
    });
  });
});
