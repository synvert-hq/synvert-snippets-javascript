const fs = require("fs");
const mock = require("mock-fs");
const Synvert = require("synvert-core");
require("../../lib/javascript/prefer-bind-operator");

describe("Prefer bind Operator", () => {
  const input = `
    let x = this.foo.bind(this);
  `;
  const output = `
    let x = ::this.foo;
  `;
  beforeEach(() => {
    mock({ "code.js": input });
  });
  afterEach(() => {
    mock.restore();
  });

  test("convert", () => {
    const rewriter = Synvert.Rewriter.fetch("javascript", "preferBindOperator");
    rewriter.process();
    expect(fs.readFileSync("code.js", "utf-8")).toEqual(output);
  });
});
