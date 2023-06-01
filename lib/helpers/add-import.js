/**
 * This is a helper to add one import name.
 *
 * It can add the default import, named imports and namespace import.
 *
 * @example
 * callHelper("helpers/add-import", { defaultImport: "React", moduleSpecifier: "react" })
 * callHelper("helpers/add-import", { namedImport: "Component", moduleSpecifier: "react" })
 * callHelper("helpers/add-import", { namespaceImport: "Component", moduleSpecifier: "react" })
 */

new Synvert.Helper("helpers/add-import", function (options) {
  if (options.defaultImport) {
    const { defaultImport, moduleSpecifier } = options;
    unlessExistNode(
      { nodeType: "ImportDeclaration" },
      () => {
        insertBefore(appendSemicolon(`import ${defaultImport} from ${wrapWithQuotes(moduleSpecifier)}`));
      },
      () => {
        withNode(
          {
            nodeType: "ImportDeclaration",
            importClause: { name: undefined },
            moduleSpecifier: { text: moduleSpecifier },
          },
          () => {
            insert(`${defaultImport}, `, { to: "importClause.namedBindings", at: "beginning" });
          }
        );
      }
    );
  }

  if (options.namedImport) {
    const { namedImport, moduleSpecifier } = options;
    unlessExistNode(
      { nodeType: "ImportDeclaration", moduleSpecifier: { text: moduleSpecifier } },
      () => {
        insertBefore(appendSemicolon(`import { ${namedImport} } from ${wrapWithQuotes(moduleSpecifier)}`));
      },
      () => {
        unlessExistNode(
          {
            nodeType: "ImportDeclaration",
            importClause: { namedBindings: { elements: { includes: namedImport } } },
            moduleSpecifier: { text: moduleSpecifier },
          },
          () => {
            ifAllNodes(
              { nodeType: "ImportDeclaration" },
              { match: { moduleSpecifier: { text: { not: moduleSpecifier } } } },
              () => {
                insertBefore(appendSemicolon(`import { ${namedImport} } from ${wrapWithQuotes(moduleSpecifier)}`));
              },
              () => {
                // import React from "react"
                withNode(
                  {
                    nodeType: "ImportDeclaration",
                    importClause: { name: { not: undefined }, namedBindings: undefined },
                    moduleSpecifier: { text: moduleSpecifier },
                  },
                  () => {
                    insert(`, { ${namedImport} }`, { to: "importClause.name", at: "end" });
                  }
                );
                // import React, { Component } from "react"
                withNode(
                  {
                    nodeType: "ImportDeclaration",
                    importClause: { name: { not: undefined }, namedBindings: { not: undefined } },
                    moduleSpecifier: { text: moduleSpecifier },
                  },
                  () => {
                    insert(`, { ${namedImport} }`, { to: "importClause.name", at: "end" });
                  }
                );
                // import { Component } from "react"
                withNode(
                  {
                    nodeType: "ImportDeclaration",
                    importClause: { name: undefined, namedBindings: { not: undefined } },
                    moduleSpecifier: { text: moduleSpecifier },
                  },
                  () => {
                    insert(`, ${namedImport}`, { to: "importClause.namedBindings.elements.-1", at: "end" });
                  }
                );
              }
            );
          }
        );
      }
    );
  }

  if (options.namespaceImport) {
    const { namespaceImport, moduleSpecifier } = options;
    unlessExistNode(
      {
        nodeType: "ImportDeclaration",
        importClause: { namedBindings: { nodeType: "NamespaceImport", name: namespaceImport } },
        moduleSpecifier: { text: moduleSpecifier },
      },
      () => {
        insertBefore(appendSemicolon(`import * as ${namespaceImport} from ${wrapWithQuotes(moduleSpecifier)}`));
      }
    );
  }
});
