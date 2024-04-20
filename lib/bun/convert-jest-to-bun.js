new Synvert.Rewriter("bun", "convert-jest-to-bun", () => {
  description(`
    convert jest to bun
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles("test/**/*.{js,ts}", function () {
    unlessExistNode(`.ImportDeclaration[moduleSpecifier=.StringLiteral[text="bun:test"]]`, () => {
      let bunImported = false;

      // import {} from "@jest/globals"
      // =>
      // import {} from "bun:test"
      findNode(`.ImportDeclaration[moduleSpecifier=.StringLiteral[text="@jest/globals"]]`, () => {
        bunImported = true;
        replace("moduleSpecifier", { with: '"bun:test"' });
      });

      if (!bunImported) {
        const JEST_GLOBALS = ["afterAll", "afterEach", "beforeAll", "beforeEach", "describe", "expect", "it", "test"];
        const importNames = [];
        // insert `import {} from "bun:test"`
        findNode(`.CallExpression[expression in (${JEST_GLOBALS.join(" ")})]`, function () {
          const name = this.currentNode.expression.escapedText;
          if (!importNames.includes(name)) {
            importNames.push(name);
          }
        });
        if (importNames.length > 0) {
          callHelper("helpers/add-import", { namedImport: importNames, moduleSpecifier: "bun:test" });
        }
      }
    });

    // expect(() => { }).toThrowError(new Error());
    // =>
    // expect(() => { }).toThrow(new Error());
    findNode(
      `.CallExpression[expression=.PropertyAccessExpression[expression=.CallExpression[expression=expect]][name=toThrowError]]`,
      () => {
        replace("expression.name", { with: "toThrow" });
      },
    );
  });
});
