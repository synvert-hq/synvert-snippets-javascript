new Synvert.Rewriter("javascript", "prefer-import-export", () => {
  description(`
    Convert require/exports to import/export.

    \`\`\`javascript
    const fs = require('fs')
    const { Node } = require('acorn')

    module.exports = Rewriter
    module.exports = { Rewriter, Configuration }
    \`\`\`

    =>

    \`\`\`javascript
    import fs from 'fs'
    import { Node } from 'acorn'

    export default Rewriter
    export { Rewriter, Configuration }
    \`\`\`
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(".VariableDeclarationList", () => {
      const declarators = [];
      for (const [index, declaration] of this.currentNode.declarations.entries()) {
        findNode(`declarations.${index} .VariableDeclaration[initializer=.CallExpression[expression=require]]`, () => {
          declarators.push({
            id: this.mutationAdapter.getSource(declaration.name),
            argument: this.mutationAdapter.getSource(declaration.initializer.arguments[0]),
          });
        });
      }
      if (declarators.length > 0) {
        replaceWith(declarators.map((declarator) => `import ${declarator.id} from ${declarator.argument}`).join("\n"));
      }
    });

    findNode(
      `.ExpressionStatement
        [expression=.BinaryExpression
          [left=.PropertyAccessExpression[expression=module][name=exports]]
          [right=.Identifier]]`,
      () => {
        replaceWith("export default {{expression.right}}");
      }
    );

    findNode(
      `.ExpressionStatement
        [expression=.BinaryExpression
          [left=.PropertyAccessExpression[expression=module][name=exports]]
          [right=.ObjectLiteralExpression]]`,
      () => {
        replaceWith("export {{expression.right}}");
      }
    );
  });
});
