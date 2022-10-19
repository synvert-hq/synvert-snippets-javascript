const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "prefer-object-has-own", () => {
  description(`
    After V8 release v9.3

    Object.prototype.hasOwnProperty.call({ prop: 42 }, 'prop')
    =>
    Object.hasOwn({ prop: 42 }, 'prop')
  `);

  configure({ parser: "typescript" });

  withinFiles(Synvert.ALL_FILES, () => {
    findNode(
      `.CallExpression
                [callee=.MemberExpression
                  [object=.MemberExpression
                    [object=.MemberExpression
                      [object=Object][property=prototype]
                    ]
                    [property=hasOwnProperty]
                  ]
                  [property=call]
                ]
                [arguments.length=2]`,
      () => {
        replace("callee", { with: "Object.hasOwn" });
      }
    );
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression
          [expression=.PropertyAccessExpression
            [expression=.PropertyAccessExpression[name=prototype]]
            [name=hasOwnProperty]]
          [name=call]]
        [arguments.length=2]`, () => {
      replace("expression", { with: "{{expression.expression.expression.expression}}.hasOwn" });
    });
  });
});
