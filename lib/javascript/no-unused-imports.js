const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "no-unused-imports", () => {
  description("do not allow unused imports");

  configure({ parser: "typescript" });

  withinFiles(Synvert.ALL_FILES, function () {
    const used = {};

    findNode(".Identifier", () => {
      const name = this.currentNode.escapedText;
      used[name] = (used[name] || 0) + 1;
    });
    // Temporarily not to remove import React from "react";
    used["React"] = (used["React"] || 0) + 1;

    const unusedNames = [];
    Object.keys(used).forEach((name) => {
      if (used[name] === 1) {
        unusedNames.push(name);
      }
    });

    findNode(".ImportDeclaration", () => {
      if (!this.currentNode.importClause) {
        // import "package";
        return;
      }
      if (this.currentNode.importClause.name) {
        if (unusedNames.includes(this.currentNode.importClause.name.escapedText)) {
          if (this.currentNode.importClause.namedBindings) {
            if (this.currentNode.importClause.namedBindings.name) {
              // import y, * as p from "package";
              if (unusedNames.includes(this.currentNode.importClause.namedBindings.name.escapedText)) {
                remove();
              } else {
                deleteNode("importClause.name");
              }
            } else {
              // import y, { a, b } from "./utils";
              if (
                this.currentNode.importClause.namedBindings.elements.every((element) =>
                  unusedNames.includes(element.name.escapedText)
                )
              ) {
                remove();
              } else {
                findNode({ nodeType: "ImportSpecifier", escapedText: { in: unusedNames } }, () => {
                  remove();
                });
                deleteNode("importClause.name");
              }
            }
          } else {
            // import y from "package";
            remove();
          }
        } else {
          gotoNode("importClause.namedBindings", () => {
            if (this.currentNode.name) {
              // import y, * as p from "package";
              if (unusedNames.includes(this.currentNode.name.escapedText)) {
                remove();
              }
            } else {
              // import y, { a, b } from "./utils";
              if (this.currentNode.elements.every((element) => unusedNames.includes(element.name.escapedText))) {
                remove();
              } else {
                findNode({ nodeType: "ImportSpecifier", escapedText: { in: unusedNames } }, () => {
                  remove();
                });
              }
            }
          });
        }
      } else {
        if (this.currentNode.importClause.namedBindings.name) {
          // import * as p from "package";
          if (unusedNames.includes(this.currentNode.importClause.namedBindings.name.escapedText)) {
            remove();
          }
        } else {
          // import { a, b } from "./utils";
          if (
            this.currentNode.importClause.namedBindings.elements.every((element) =>
              unusedNames.includes(element.name.escapedText)
            )
          ) {
            remove();
          } else {
            findNode({ nodeType: "ImportSpecifier", name: { in: unusedNames } }, () => {
              remove();
            });
          }
        }
      }
    });
  });
});
