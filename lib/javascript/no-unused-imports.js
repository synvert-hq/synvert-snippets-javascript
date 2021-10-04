const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "no-unused-imports", () => {
  description("do not allow unused imports");

  withinFiles(Synvert.ALL_FILES, function () {
    const imported = {};
    const used = {};
    withNode({ type: "ImportDeclaration" }, () => {
      withNode({ type: { in: ["ImportSpecifier", "ImportDefaultSpecifier", "ImportNamespaceSpecifier"] } }, () => {
        const localName = this.currentNode.local.name;
        imported[localName] = this.currentNode.loc.end.line;
        used[localName] = false;
      });
    });

    Object.keys(imported).forEach((name) => {
      withNode({ type: { in: ["Identifier", "JSXIdentifier"] }, name }, () => {
        if (this.currentNode.loc.start.line > imported[name]) {
          used[name] = true;
        }
      });
    });

    const unusedNames = [];
    Object.keys(used).forEach((name) => {
      if (used[name] === false) {
        unusedNames.push(name);
      }
    });
    const matchRules = { local: { name: { in: unusedNames } } };
    withNode({ type: "ImportDeclaration" }, () => {
      ifAllNodes(
        { type: { in: ["ImportDefaultSpecifier", "ImportSpecifier", "ImportNamespaceSpecifier"] } },
        { match: matchRules },
        () => {
          remove(); // remove the whole import declaration
        },
        () => {
          withNode({ type: "ImportDefaultSpecifier", ...matchRules }, () => {
            remove(); // remove default import
          });
          withNode({ type: "ImportNamespaceSpecifier", ...matchRules }, () => {
            remove(); // remove namespace import
          });
          ifAllNodes(
            { type: "ImportSpecifier" },
            { match: matchRules },
            () => {
              deleteNode("specifiers"); // remove all import specifiers in { }
            },
            () => {
              withNode({ type: "ImportSpecifier", ...matchRules }, () => {
                remove(); // remove single import specifier in { }
              });
            }
          );
        }
      );
    });
  });
});
