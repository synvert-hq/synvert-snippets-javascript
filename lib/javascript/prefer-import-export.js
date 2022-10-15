const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "prefer-import-export", () => {
  description(`
    convert require/exports to import/export

    const fs = require('fs')
    const { Node } = require('acorn')

    module.exports = Rewriter
    module.exports = { Rewriter, Configuration }

    =>

    import fs from 'fs'
    import { Node } from 'acorn'

    export default Rewriter
    export { Rewriter, Configuration }
  `);

  configure({ parser: "espree" });

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(".VariableDeclaration", () => {
      const declarators = [];
      this.currentNode.declarations.forEach((declaration, index) => {
        findNode(`declarations.${index} .VariableDeclarator[init=.CallExpression[callee=require]]`, () => {
          declarators.push({ id: declaration.id.toSource(), argument: declaration.init.arguments[0].toSource() });
        });
      });
      if (declarators.length > 0) {
        replaceWith(declarators.map((declarator) => `import ${declarator.id} from ${declarator.argument}`).join("\n"));
      }
    });

    findNode(
      `.ExpressionStatement
                [expression=.AssignmentExpression
                  [left=.MemberExpression[object=module][property=exports]]
                  [right=.Identifier]]`,
      () => {
        replaceWith("export default {{expression.right}}");
      }
    );

    findNode(
      `.ExpressionStatement
                [expression=.AssignmentExpression
                  [left=.MemberExpression[object=module][property=exports]]
                  [right=.ObjectExpression]]`,
      () => {
        replaceWith("export {{expression.right}}");
      }
    );
  });
});
