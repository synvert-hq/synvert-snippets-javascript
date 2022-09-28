const Synvert = require("synvert-core");

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
      `.MethodDefinition[kind=constructor][value.body.body.length=1]
                [value.body.body.0=.ExpressionStatement[expression=.CallExpression[callee=super]]]
                [value.params="{{value.body.body.0.expression.arguments}}"]`,
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
    findNode(".MethodDefinition[kind=constructor][value.params.length=0][value.body.body.length=0]", () => {
      remove();
    });
  });
});
