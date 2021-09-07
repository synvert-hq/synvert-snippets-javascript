const fs = require("fs");
const mock = require("mock-fs");
const Synvert = require("synvert-core");

const assertConvert = (options) => {
  const path = options["path"] || "code.js";
  const input = options["input"];
  const output = options["output"];

  beforeEach(() => {
    mock({ [path]: input });
  });

  afterEach(() => {
    mock.restore();
  });

  test("convert", () => {
    const [group, name] = options["snippet"].split("/");
    const rewriter = Synvert.Rewriter.fetch(group, name);
    rewriter.process();
    expect(fs.readFileSync(path, "utf-8")).toEqual(output);
  });
};

module.exports = { assertConvert };
