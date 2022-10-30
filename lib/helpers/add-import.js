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

if (this.options.defaultImport) {
  const { defaultImport, moduleSpecifier } = this.options;
  unlessExistNode(
    { nodeType: "ImportDeclaration", importClause: { name: defaultImport }, moduleSpecifier },
    () => { insertBefore(`import ${defaultImport} from "${moduleSpecifier}";`) }
  );
}

if (this.options.namedImport) {
  const { namedImport, moduleSpecifier } = this.options;
  unlessExistNode(
    { nodeType: "ImportDeclaration", importClause: { namedBindings: { elements: { includes: namedImport } } }, moduleSpecifier },
    () => {
      ifExistNode(
        { nodeType: "ImportDeclaration", importClause: { name: { not: undefined }, namedBindings: undefined }, moduleSpecifier },
        () => {
          withNode({ nodeType: "ImportDeclaration", importClause: { name: { not: undefined }, namedBindings: undefined }, moduleSpecifier }, () => {
            insert(`, { ${namedImport} }`, { to: "importClause.name", at: "end" });
          });
        },
        () => {
          ifExistNode(
            { nodeType: "ImportDeclaration", importClause: { name: undefined, namedBindings: { not: undefined } }, moduleSpecifier },
            () => {
              withNode({ nodeType: "ImportDeclaration", importClause: { name: undefined, namedBindings: { not: undefined } }, moduleSpecifier }, () => {
                insert(`, ${namedImport}`, { to: "importClause.namedBindings.elements.-1", at: "end" });
              });
            },
            () => {
              insertBefore(`import { ${namedImport} } from "${moduleSpecifier}";`)
            }
          )
        }
      )
    }
  );
}

if (this.options.namespaceImport) {
  const { namespaceImport, moduleSpecifier } = this.options;
  unlessExistNode(
    { nodeType: "ImportDeclaration", importClause: { namedBindings: { nodeType: "NamespaceImport", name: namespaceImport } }, moduleSpecifier },
    () => { insertBefore(`import * as ${namespaceImport} from "${moduleSpecifier}";`) }
  );
}