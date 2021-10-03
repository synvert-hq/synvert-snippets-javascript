const Synvert = require("synvert-core");
const { ALL_FILES } = require("../constants");

new Synvert.Rewriter("javascript", "no-useless-constructor", () => {
  /**
   * no useless constructor
   *
   * class A {
   *   constructor () {
   *   }
   * }
   *
   * class B extends A {
   *   constructor (...args) {
   *     super(...args);
   *   }
   * }
   *
   * =>
   *
   * class A {
   * }
   *
   * class B extends A {
   * }
   */
  withinFiles(ALL_FILES, function () {
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
    withNode({ type: "MethodDefinition", kind: "constructor" }, () => {
      ifOnlyExistNode(
        {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: "super",
          },
        },
        () => {
          if (
            this.currentNode.childNodeSource("value.params") ===
            this.currentNode.childNodeSource("value.body.body.0.expression.arguments")
          ) {
            remove();
          }
        }
      );
    });

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
    withNode(
      {
        type: "MethodDefinition",
        kind: "constructor",
        value: { params: { length: 0 }, body: { body: { length: 0 } } },
      },
      () => {
        remove();
      }
    );
  });
});
