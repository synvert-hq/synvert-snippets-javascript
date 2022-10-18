/**
 * This is a helper to remove one or more import names.
 *
 * It can remove the default import, named imports and namespace import,
 * it will also remove the `{}` if needed.
 *
 * @example
 * callHelper("helpers/remove-imports", { importNames: ["Component", "Fragment"] })
 */

const importNames = this.options.importNames;

findNode(".ImportDeclaration", () => {
  if (!this.currentNode.importClause) {
    // import "package";
    return;
  }
  if (this.currentNode.importClause.name) {
    if (importNames.includes(this.currentNode.importClause.name.escapedText)) {
      if (this.currentNode.importClause.namedBindings) {
        if (this.currentNode.importClause.namedBindings.name) {
          // import y, * as p from "package";
          if (importNames.includes(this.currentNode.importClause.namedBindings.name.escapedText)) {
            remove();
          } else {
            deleteNode("importClause.name");
          }
        } else {
          // import y, { a, b } from "./utils";
          if (
            this.currentNode.importClause.namedBindings.elements.every((element) =>
              importNames.includes(element.name.escapedText)
            )
          ) {
            remove();
          } else {
            findNode({ nodeType: "ImportSpecifier", escapedText: { in: importNames } }, () => {
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
          if (importNames.includes(this.currentNode.name.escapedText)) {
            remove();
          }
        } else {
          // import y, { a, b } from "./utils";
          if (this.currentNode.elements.every((element) => importNames.includes(element.name.escapedText))) {
            remove();
          } else {
            findNode({ nodeType: "ImportSpecifier", escapedText: { in: importNames } }, () => {
              remove();
            });
          }
        }
      });
    }
  } else {
    if (this.currentNode.importClause.namedBindings.name) {
      // import * as p from "package";
      if (importNames.includes(this.currentNode.importClause.namedBindings.name.escapedText)) {
        remove();
      }
    } else {
      // import { a, b } from "./utils";
      if (
        this.currentNode.importClause.namedBindings.elements.every((element) =>
          importNames.includes(element.name.escapedText)
        )
      ) {
        remove();
      } else {
        findNode({ nodeType: "ImportSpecifier", name: { in: importNames } }, () => {
          remove();
        });
      }
    }
  }
});
