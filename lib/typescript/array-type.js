new Synvert.Rewriter("typescript", "array-type", () => {
  configure({ parser: Synvert.Parser.TYPESCRIPT });

  description(`
    Convert typescript array type from Array<string> to string[]

    \`\`\`javascript
    const x: Array<string> = ['a', 'b'];
    const y: ReadonlyArray<string> = ['a', 'b'];
    const z: Array<string | number> = ['a', 'b'];
    \`\`\`

    =>

    \`\`\`javascript
    const x: string[] = ['a', 'b'];
    const y: readonly string[] = ['a', 'b'];
    const z: (string | number)[] = ['a', 'b'];
    \`\`\`
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
