new Synvert.Rewriter("javascript", "no-unused-imports", () => {
  description("Do not allow unused imports");

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    const used = {};

    findNode(".ImportDeclaration .Identifier", () => {
      const name = this.currentNode.escapedText;
      used[name] = 0;
    });

    findNode({ nodeType: "Identifier", escapedText: { in: Object.keys(used) } }, () => {
      const name = this.currentNode.escapedText;
      used[name]++;
    });
    // Temporarily not to remove import React from "react";
    delete used.React;

    const unusedNames = [];
    Object.keys(used).forEach((name) => {
      if (used[name] === 1) {
        unusedNames.push(name);
      }
    });

    callHelper("helpers/remove-imports", { importNames: unusedNames });
  });
});
