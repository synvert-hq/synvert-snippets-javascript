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
    ifExistNode('.ImportDeclaration[moduleSpecifier.text="react"] .ImportSpecifier[name=PropTypes]', () => {
      callHelper("helpers/add-import", { defaultImport: "PropTypes", moduleSpecifier: "prop-types" });
      callHelper("helpers/remove-imports", { importNames: ["PropTypes"] });
    });
  });
});
