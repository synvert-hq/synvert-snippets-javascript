/**
 * This is a helper to add one import name.
 *
 * It can add the default import, named imports and namespace import.
 *
 * @example
 * callHelper("helpers/add-import", { defaultImport: "React", moduleSpecifier: "react" })
 * callHelper("helpers/add-import", { namedImport: "Component", moduleSpecifier: "react" })
 * callHelper("helpers/add-import", { namedImport: ["Component", "Fragment"], moduleSpecifier: "react" })
 * callHelper("helpers/add-import", { namespaceImport: "Component", moduleSpecifier: "react" })
 */

new Synvert.Helper("helpers/add-import", function (options) {
  if (options.defaultImport) {
    const { defaultImport, moduleSpecifier } = options;
    unlessExistNode(
      { nodeType: "ImportDeclaration", moduleSpecifier: { text: moduleSpecifier } },
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
      },
    );
  }

  if (options.namedImport) {
    const { namedImport, moduleSpecifier } = options;
    const namedImports = Array.isArray(namedImport) ? namedImport : [namedImport];
    const usedNamedImports = [];
    for (const name of namedImports) {
      withNode({ nodeType: "ImportDeclaration", importClause: { namedBindings: { elements: { includes: name } } } }, () => {
        usedNamedImports.push(name);
      });
    }
    const unusedNamedImports = namedImports.filter((name) => !usedNamedImports.includes(name));
    if (unusedNamedImports.length > 0) {
      unlessExistNode(
        { nodeType: "ImportDeclaration", moduleSpecifier: { text: moduleSpecifier } },
        () => {
          insertBefore(appendSemicolon(`import { ${unusedNamedImports.join(", ")} } from ${wrapWithQuotes(moduleSpecifier)}`));
        },
        () => {
          ifAllNodes(
            { nodeType: "ImportDeclaration" },
            { match: { moduleSpecifier: { text: { not: moduleSpecifier } } } },
            () => {
              insertBefore(appendSemicolon(`import { ${unusedNamedImports.join(", ")} } from ${wrapWithQuotes(moduleSpecifier)}`));
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
                  insert(`, { ${unusedNamedImports.join(", ")} }`, { to: "importClause.name", at: "end" });
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
                  insert(`, { ${unusedNamedImports.join(", ")} }`, { to: "importClause.name", at: "end" });
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
                  insert(`, ${unusedNamedImports.join(", ")}`, { to: "importClause.namedBindings.elements.-1", at: "end" });
                }
              );
            }
          );
        }
      );
    }
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
