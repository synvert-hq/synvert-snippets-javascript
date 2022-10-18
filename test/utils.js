const fs = require("fs");
const path = require("path");
const mock = require("mock-fs");
const Synvert = require("synvert-core");

const assertConvert = (options) => {
  const snippetPath = options["path"] || "code.js";
  const input = options["input"];
  const output = options["output"];

  beforeEach(() => {
    mock({ [snippetPath]: input });
    if (options.helper) {
      process.env.SYNVERT_SNIPPETS_HOME = path.join(__dirname, "..");
      const helperLibraryPath = path.join(process.env.SYNVERT_SNIPPETS_HOME, "lib", options.helper + ".js");
      const helperContent = fs.readFileSync(helperLibraryPath, "utf-8");
      mock({ [helperLibraryPath]: helperContent });
    }
  });

  afterEach(() => {
    mock.restore();
  });

  test("convert", () => {
    const [group, name] = options["snippet"].split("/");
    const rewriter = Synvert.Rewriter.fetch(group, name);
    rewriter.process();
    expect(fs.readFileSync(snippetPath, "utf-8")).toEqual(output);
  });
};

const assertHelper = (options) => {
  const helperPath = options["path"] || "code.js";
  const input = options["input"];
  const output = options["output"];

  beforeEach(() => {
    process.env.SYNVERT_SNIPPETS_HOME = path.join(__dirname, "..");
    const helperLibraryPath = path.join(process.env.SYNVERT_SNIPPETS_HOME, "lib", options.helper + ".js");
    const helperContent = fs.readFileSync(helperLibraryPath, "utf-8");
    mock({
      [helperLibraryPath]: helperContent,
      [helperPath]: input,
    });
  });

  afterEach(() => {
    mock.restore();
  });

  test("convert", () => {
    const rewriter = new Synvert.Rewriter("group", "name", () => {
      configure({ parser: "typescript" });
      withinFiles("*.{js,jsx}", () => {
        callHelper(options.helper, options.options);
      });
    });
    rewriter.process();
    expect(fs.readFileSync(helperPath, "utf-8")).toEqual(output);
  });
};

module.exports = { assertConvert, assertHelper };
