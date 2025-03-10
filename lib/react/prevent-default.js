function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

new Synvert.Rewriter("react", "prevent-default", () => {
  description(`
    convert foo to bar
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    callHelper('helpers/find-react-component', () => {
      // { functionName: 'functionNotDefined' } the function is not defined;
      // { functionName: 'functionNoEventParameter' } the function is defined but not event parameter;
      // { functionName: 'preventDefaultNotCalled' } the function is defined with event parameter but not call preventDefault();
      // { functionName: 'preventDefaultCalled' } the function is defined with event parameter and call preventDefault();
      const onClickPreventDefault = {};

      // find a elements whose href attribute is '#'
      findNode(`
        .JsxElement
          [openingElement=.JsxOpeningElement
            [tagName=a]
            [attributes=.JsxAttributes
              [properties includes .JsxAttribute
                [name=href]
                [initializer=.StringLiteral[text="#"]]
              ]
            ]
          ]
          [closingElement=.JsxClosingElement[tagName=a]]`,
        () => {
          findNode(`.JsxAttribute[name=onClick]`, () => {
            onClickPreventDefault[this.currentNode.initializer.expression.escapedText] = 'functionNotDefined';
          });
        }
      );

      for (const functionName of Object.keys(onClickPreventDefault)) {
        findNode(`.VariableDeclaration[name=${functionName}][initializer=.ArrowFunction]`, () => {
          if (this.currentNode.initializer.parameters.length === 0) {
            // no parameters
            onClickPreventDefault[functionName] = 'functionNoEventParameter';
          } else {
            // has parameters
            onClickPreventDefault[functionName] = 'preventDefaultNotCalled';
            const eventVariable = this.currentNode.initializer.parameters[0].name.escapedText;
            findNode(`.CallExpression[expression=.PropertyAccessExpression[name=preventDefault][expression=${eventVariable}]]`, () => {
              onClickPreventDefault[functionName] = 'preventDefaultCalled';
            });
          }
        });
      }

      for (const [functionName, reason] of Object.entries(onClickPreventDefault)) {
        if (reason === 'functionNotDefined') {
          findNode(`
            .JsxElement
              [openingElement=.JsxOpeningElement
                [tagName=a]
                [attributes=.JsxAttributes
                  [properties includes .JsxAttribute
                    [name=href]
                    [initializer=.StringLiteral[text="#"]]
                  ]
                ]
              ]
              [closingElement=.JsxClosingElement[tagName=a]] .JsxAttribute[name=onClick][initializer=.JsxExpression[expression=${functionName}]]`,
            () => {
              replace('initializer', { with: `{on${capitalizeFirstLetter(functionName)}}` });
            }
          );

          findNode(`.ReturnStatement`, () => {
            insertBefore(`
const on${capitalizeFirstLetter(functionName)} = (event) => {
  event.preventDefault();

  ${functionName}();
}
            `.trim() + "\n", { fixIndent: true });
          });
        }

        if (reason === 'functionNoEventParameter') {
          findNode(`.VariableDeclaration[name=${functionName}][initializer=.ArrowFunction]`, () => {
            replace('initializer.parameters', { with: '(event)' });
            prepend("event.preventDefault();\n");
          });
        }
      }
    });
  });
});
