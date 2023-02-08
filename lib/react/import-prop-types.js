new Synvert.Rewriter("react", "import-prop-types", () => {
  description(`
    \`\`\`javascript
    import React, { Component, PropTypes } from 'react'
    \`\`\`

    =>

    \`\`\`javascript
    import React, { Component } from 'react'
    import PropTypes from 'prop-types'
    \`\`\`
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
        insertAfter(appendSemicolon(`import PropTypes from ${wrapWithQuotes("prop-types")}`));
      }
    });
  });
});
