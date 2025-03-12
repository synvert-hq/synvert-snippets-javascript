function convertToFunctionName(name) {
  if (name.startsWith('on')) {
    return name.replace(/^on/, 'handle');
  } else {
    return `on${name.charAt(0).toUpperCase() + name.slice(1)}`;
  }
}

function invertKeyValues(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(entry => entry.reverse())
  );
}

new Synvert.Rewriter("react", "prevent-default", () => {
  description(`
    Force add preventDefault() to onClick event handler.

    \`\`\`javascript
      const Post = ({ newPost, doDelete }) => {
        const deletePost = () => {
          doDelete();
        }

        return (
          <a href="#" onClick={newPost}>New</a>
          <a href="#" onClick={deletePost}>Delete</a>
        )
      }
      export default Post;
    \`\`\`

    =>

    \`\`\`javascript
      const Post = ({ newPost, doDelete }) => {
        const deletePost = (event) => {
          event.preventDefault();

          doDelete();
        }

        const onNewPost = (event) => {
          event.preventDefault();

          newPost();
        }

        return (
          <a href="#" onClick={onNewPost}>New</a>
          <a href="#" onClick={deletePost}>Delete</a>
        )
      }
      export default Post;
    \`\`\`
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    callHelper('helpers/find-react-component', () => {
      // { functionName: 'functionNotDefined' } the function is not defined;
      // { functionName: 'functionNoEventParameter' } the function is defined but not event parameter;
      // { functionName: 'preventDefaultNotCalled' } the function is defined with event parameter but not call preventDefault();
      // { functionName: 'preventDefaultCalled' } the function is defined with event parameter and call preventDefault();
      const onClickPreventDefault = {};
      const onClickCode = {};

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
          findNode(`.JsxAttribute[name=onClick][initializer=.JsxExpression[expression=.Identifier]]`, () => {
            onClickPreventDefault[this.currentNode.initializer.expression.escapedText] = 'functionNotDefined';
            onClickCode[this.currentNode.initializer.expression.escapedText] = this.mutationAdapter.getSource(this.currentNode.initializer.expression) + '()';
          });
          findNode(`.JsxAttribute[name=onClick][initializer=.JsxExpression[expression=.ArrowFunction[body=.CallExpression]]]`, () => {
            onClickPreventDefault[this.currentNode.initializer.expression.body.expression.escapedText] = 'functionNotDefined';
            onClickCode[this.currentNode.initializer.expression.body.expression.escapedText] = this.mutationAdapter.getSource(this.currentNode.initializer.expression.body);
          });
          findNode(`.JsxAttribute[name=onClick][initializer=.JsxExpression[expression=.ArrowFunction[body=.Block[statements.length>0]]]]`, () => {
            onClickPreventDefault[this.currentNode.initializer.expression.body.statements[0].expression.expression.escapedText] = 'functionNotDefined';
            onClickCode[this.currentNode.initializer.expression.body.statements[0].expression.expression.escapedText] = this.currentNode.initializer.expression.body.statements.map(statement => this.mutationAdapter.getSource(statement)).join("\n");
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
              [closingElement=.JsxClosingElement[tagName=a]]`,
            () => {
              findNode(`
                .JsxAttribute
                  [name=onClick]
                  [initializer=.JsxExpression
                    [expression IN (
                      ${functionName}
                      .ArrowFunction
                        [body=.CallExpression
                          [expression=${functionName}]
                        ]
                      .ArrowFunction
                        [body=.Block
                          [statements.length>0]
                          [statements.0.expression.expression=${functionName}]
                        ]
                    )]
                  ]`, () => {
                replace('initializer', { with: `{${convertToFunctionName(functionName)}}` });
              });
            }
          );

          findNode(`.Block:first-child > .ReturnStatement`, () => {
            insertBefore(`
const ${convertToFunctionName(functionName)} = (event) => {
  event.preventDefault();

  ${onClickCode[functionName]};
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
