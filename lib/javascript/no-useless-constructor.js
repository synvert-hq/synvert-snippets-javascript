const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "no-useless-constructor", () => {
  description(`
    No useless constructor.

    \`\`\`javascript
    class A {
      constructor () {
      }
    }

    class B extends A {
      constructor (...args) {
        super(...args);
      }
    }
    \`\`\`

    =>

    \`\`\`javascript
    class A {
    }

    class B extends A {
    }
    \`\`\`
  `)
  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    /**
     * class B extends A {
     *   constructor (...args) {
     *     super(...args);
     *   }
     * }
     *
     * =>
     *
     * class B extends A {
     * }
     */
    findNode(
      `.Constructor[body.statements.length=1]
        [body.statements.0=.ExpressionStatement[expression=.CallExpression[expression=.SuperKeyword]]]
        [parameters="{{body.statements.0.expression.arguments}}"]`,
      () => {
        remove();
      }
    );

    /**
     *
     * class A {
     *   constructor () {
     *   }
     * }
     *
     * =>
     *
     * class A {
     * }
     */
    findNode(".Constructor[parameters.length=0][body.statements.length=0]", () => {
      remove();
    });
  });
});
