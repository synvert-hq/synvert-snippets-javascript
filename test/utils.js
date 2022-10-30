const fs = require("fs");
const path = require("path");
const mock = require("mock-fs");
const Synvert = require("synvert-core");

const assertConvert = (options) => {
  const snippetPath = options["path"] || "code.js";
  const input = options["input"];
  const output = options["output"];

  beforeEach(() => {
    if (options.helpers) {
      process.env.SYNVERT_SNIPPETS_HOME = path.join(__dirname, "..");
      const helperMocks = {};
      options.helpers.forEach(helper => {
        const helperLibraryPath = path.join(process.env.SYNVERT_SNIPPETS_HOME, "lib", helper + ".js");
        const helperContent = fs.readFileSync(helperLibraryPath, "utf-8");
        helperMocks[helperLibraryPath] = helperContent;
      });
      mock({ ...{ [snippetPath]: input }, ...helperMocks });
    } else {
      mock({ [snippetPath]: input });
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
      configure({ parser: Synvert.Parser.TYPESCRIPT });
      withinFiles("*.{js,jsx}", () => {
        callHelper(options.helper, options.options);
      });
    });
    rewriter.process();
    expect(fs.readFileSync(helperPath, "utf-8")).toEqual(output);
  });
};

module.exports = { assertConvert, assertHelper };
