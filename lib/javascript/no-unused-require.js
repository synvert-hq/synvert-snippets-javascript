const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "no-unused-require", () => {
  description("do not allow unused require");

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    const used = {};

    findNode(".Identifier", () => {
      const name = this.currentNode.escapedText;
      used[name] = (used[name] || 0) + 1;
    });

    const unusedNames = [];
    Object.keys(used).forEach((name) => {
      if (used[name] === 1) {
        unusedNames.push(name);
      }
    });

    const matchingRules = function (node) {
      if (node.name.elements) {
        // const { a, b } = require("y");
        return node.name.elements.every((element) => unusedNames.includes(element.name.escapedText));
      } else {
        // const x = require("x");
        return unusedNames.includes(node.name.escapedText);
      }
    };
    findNode(".VariableDeclarationList", () => {
      ifAllNodes(
        { nodeType: "VariableDeclaration", initializer: { nodeType: "CallExpression", expression: "require" } },
        { match: matchingRules },
        () => {
          remove(); // remove the whole require declaration
        },
        () => {
          findNode(
            {
              nodeType: "VariableDeclaration",
              name: { nodeType: "Identifier", escapedText: { in: unusedNames } },
              initializer: { nodeType: "CallExpression", expression: "require" },
            },
            () => {
              remove(); // remove default require declarator
            }
          );
          findNode(
            ".VariableDeclaration[name=.ObjectBindingPattern][initializer=.CallExpression[expression=require]]",
            () => {
              ifAllNodes(
                { nodeType: "BindingElement" },
                { match: { name: { in: unusedNames } } },
                () => {
                  remove(); // remove all require declarators in { }
                },
                () => {
                  findNode({ nodeType: "BindingElement", name: { in: unusedNames } }, () => {
                    remove(); // remove single require declarator in { }
                  });
                }
              );
            }
          );
        }
      );
    });
  });
});
