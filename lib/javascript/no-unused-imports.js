const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "no-unused-imports", () => {
  description("do not allow unused imports");

  withinFiles(Synvert.ALL_JS_FILES, function () {
    const imported = {};
    const used = {};
    findNode(
      `.ImportDeclaration .ImportSpecifier,
                .ImportDeclaration .ImportDefaultSpecifier,
                .ImportDeclaration .ImportNamespaceSpecifier`,
      () => {
        const localName = this.currentNode.local.name;
        if (localName === "React") return;

        imported[localName] = this.currentNode.loc.end.line;
        used[localName] = false;
      }
    );

    Object.keys(imported).forEach((name) => {
      findNode(`.Identifier[name=${name}], .JSXIdentifier[name=${name}]`, () => {
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
    findNode(".ImportDeclaration", () => {
      ifAllNodes(
        { type: { in: ["ImportDefaultSpecifier", "ImportSpecifier", "ImportNamespaceSpecifier"] } },
        { match: matchRules },
        () => {
          remove(); // remove the whole import declaration
        },
        () => {
          findNode(
            `.ImportDefaultSpecifier[local.name IN (${unusedNames.join(" ")})],
                      .ImportNamespaceSpecifier[local.name IN (${unusedNames.join(" ")})]`,
            () => {
              remove(); // remove default import
            }
          );
          ifAllNodes(
            { type: "ImportSpecifier" },
            { match: matchRules },
            () => {
              deleteNode("specifiers"); // remove all import specifiers in { }
            },
            () => {
              findNode(`.ImportSpecifier[local.name IN (${unusedNames.join(" ")})]`, () => {
                remove(); // remove single import specifier in { }
              });
            }
          );
        }
      );
    });
  });
});
