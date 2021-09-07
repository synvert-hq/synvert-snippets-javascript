const fs = require("fs");
const mock = require("mock-fs");
const Synvert = require("synvert-core");
require("../../lib/javascript/prefer-string-trim-start-end");

describe("Prefer String trimStart and trimEnd", () => {
  const input = `
    const foo1 = bar.trimLeft();
    const foo2 = bar.trimRight();
  `;
  const output = `
    const foo1 = bar.trimStart();
    const foo2 = bar.trimEnd();
  `;
  beforeEach(() => {
    mock({ "code.js": input });
  });
  afterEach(() => {
    mock.restore();
  });

  test("convert", () => {
    const rewriter = Synvert.Rewriter.fetch("javascript", "preferStringTrimStartEnd");
    rewriter.process();
    expect(fs.readFileSync("code.js", "utf-8")).toEqual(output);
  });
});
