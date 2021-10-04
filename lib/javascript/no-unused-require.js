const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "no-unused-require", () => {
  description("do not allow unused require");

  withinFiles(Synvert.ALL_FILES, function () {
    const required = {}
    const used = {}
    withNode({ type: "VariableDeclarator", id: { type: "Identifier" }, init: { type: "CallExpression", callee: "require" } }, () => {
      const name = this.currentNode.id.name;
      required[name] = this.currentNode.loc.end.line;
      used[name] = false;
    });
    withNode({ type: "VariableDeclarator", id: { type: "ObjectPattern" }, init: { type: "CallExpression", callee: "require" } }, () => {
      this.currentNode.id.properties.forEach(property => {
        const name = property.value.name;
        required[name] = this.currentNode.loc.end.line;
        used[name] = false;
      });
    });

    Object.keys(required).forEach(name => {
      withNode({ type: 'Identifier', name }, () => {
        if (this.currentNode.loc.start.line > required[name]) {
          used[name] = true
        }
      })
    });

    const unusedNames = [];
    Object.keys(used).forEach(name => {
      if (used[name] === false) {
        unusedNames.push(name);
      }
    });
    const matchingRules = function (node) {
      if (node.id.type === "Identifier") {
        return unusedNames.includes(node.id.name);
      } else { // node.id.type === "ObjectPattern"
        return node.id.properties.every(property => unusedNames.includes(property.value.name));
      }
    }
    withNode({ type: "VariableDeclaration" }, () => {
      ifAllNodes({ type: "VariableDeclarator", init: { type: "CallExpression", callee: "require" } }, { match: matchingRules }, () => {
        remove(); // remove the whole require declaration
      }, () => {
        withNode({ type: "VariableDeclarator", id: { type: "Identifier", name: { in: unusedNames } }, init: { type: "CallExpression", callee: "require" } }, () => {
          remove(); // remove default require declarator
        });
        withNode({ type: "VariableDeclarator", id: { type: "ObjectPattern" }, init: { type: "CallExpression", callee: "require" } }, () => {
          ifAllNodes({ type: "Property" }, { match: { value: { name: { in: unusedNames } } } }, () => {
            remove(); // remove all require declarators in { }
          }, () => {
            withNode({ type: "Property", value: { name: { in: unusedNames } } }, () => {
              remove(); // remove single require declarator in { }
            });
          });
        });
      });
    });
  });
});