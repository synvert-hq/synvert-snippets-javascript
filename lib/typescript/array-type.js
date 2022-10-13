const Synvert = require("synvert-core");

new Synvert.Rewriter("typescript", "array-type", () => {
  configure({ parser: "typescript" });

  description(`
    Convert typescript array type from Array<string> to string[]

    const x: Array<string> = ['a', 'b'];
    const y: ReadonlyArray<string> = ['a', 'b'];
    const z: Array<string | number> = ['a', 'b'];
    =>
    const x: string[] = ['a', 'b'];
    const y: readonly string[] = ['a', 'b'];
    const z: (string | number)[] = ['a', 'b'];
  `);

  withinFiles(Synvert.ALL_TS_FILES, function () {
    findNode(".TypeReference[typeName.escapedText=Array][typeArguments.0=.UnionType]", () => {
      replaceWith("({{typeArguments}})[]");
    });

    findNode(".TypeReference[typeName.escapedText=Array][typeArguments.0!=.UnionType]", () => {
      replaceWith("{{typeArguments}}[]");
    });

    findNode(".TypeReference[typeName.escapedText=ReadonlyArray][typeArguments.0=.UnionType]", () => {
      replaceWith("readonly ({{typeArguments}})[]");
    });

    findNode(".TypeReference[typeName.escapedText=ReadonlyArray][typeArguments.0!=.UnionType]", () => {
      replaceWith("readonly {{typeArguments}}[]");
    });
  });
});
