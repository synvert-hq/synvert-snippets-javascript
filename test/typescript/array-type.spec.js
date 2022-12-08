const snippet = "typescript/array-type";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  const input = `
    const x: Array<string> = ['a', 'b'];
    const y: ReadonlyArray<string> = ['a', 'b'];
    const z: Array<string | number> = ['a', 'b'];
  `;

  const output = `
    const x: string[] = ['a', 'b'];
    const y: readonly string[] = ['a', 'b'];
    const z: (string | number)[] = ['a', 'b'];
  `;

  assertConvert({
    path: "code.ts",
    input,
    output,
    snippet,
  });
});
