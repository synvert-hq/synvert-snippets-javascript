const Synvert = require("synvert-core");
const { InsertAction } = require("synvert-core/lib/action");

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

  withFiles("**/*.js", function () {
    withNode({ type: "VariableDeclaration" }, () => {
      const declarators = [];
      for (const [index, declaration] of this.currentNode.declarations.entries()) {
        gotoNode(`declarations.${index}`, () => {
          withNode({ type: "VariableDeclarator", init: { callee: "require" } }, () => {
            declarators.push({ id: declaration.id.toSource(), argument: declaration.init.arguments[0].toSource() });
          });
        });
      }
      if (declarators.length > 0) {
        replaceWith(declarators.map((declarator) => `import ${declarator.id} from ${declarator.argument}`).join("\n"));
      }
    });

    withNode(
      {
        type: "ExpressionStatement",
        expression: {
          type: "AssignmentExpression",
          left: { type: "MemberExpression", object: "module", property: "exports" },
          right: { type: "Identifier" },
        },
      },
      () => {
        replaceWith("export default {{expression.right}}");
      }
    );

    withNode(
      {
        type: "ExpressionStatement",
        expression: {
          type: "AssignmentExpression",
          left: { type: "MemberExpression", object: "module", property: "exports" },
          right: { type: "ObjectExpression" },
        },
      },
      () => {
        replaceWith("export {{expression.right}}");
      }
    );
  });
});
