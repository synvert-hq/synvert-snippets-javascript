const fs = require("fs");
const mock = require("mock-fs");
const Synvert = require("synvert-core");
require("../../lib/javascript/prefer-object-has-own");

describe("Prefer Object hasOwn", () => {
  const input = `
    Object.prototype.hasOwnProperty.call({ prop: 42 }, 'prop')
  `;
  const output = `
    Object.hasOwn({ prop: 42 }, 'prop')
  `;
  beforeEach(() => {
    mock({ "code.js": input });
  });
  afterEach(() => {
    mock.restore();
  });

  test("convert", () => {
    const rewriter = Synvert.Rewriter.fetch("javascript", "preferObjectHasOwn");
    rewriter.process();
    expect(fs.readFileSync("code.js", "utf-8")).toEqual(output);
  });
});
