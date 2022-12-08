const fs = require("fs");
const path = require("path");
const mock = require("mock-fs");
const Synvert = require("synvert-core");

const assertConvert = (options) => {
  const snippetPath = options.path || "code.js";
  const { input, output } = options;

  beforeEach(() => {
    process.env.SYNVERT_SNIPPETS_HOME = path.join(__dirname, "..");
    const libraryPath = path.join(process.env.SYNVERT_SNIPPETS_HOME, "lib", options.snippet + ".js");
    const libraryContent = fs.readFileSync(libraryPath, "utf-8");
    if (options.helpers) {
      process.env.SYNVERT_SNIPPETS_HOME = path.join(__dirname, "..");
      const helperMocks = {};
      options.helpers.forEach((helper) => {
        const helperLibraryPath = path.join(process.env.SYNVERT_SNIPPETS_HOME, "lib", helper + ".js");
        const helperContent = fs.readFileSync(helperLibraryPath, "utf-8");
        helperMocks[helperLibraryPath] = helperContent;
      });
      mock({
        [libraryPath]: libraryContent,
        [snippetPath]: input,
        ...helperMocks,
      });
    } else {
      mock({
        [libraryPath]: libraryContent,
        [snippetPath]: input,
      });
    }
  });

  afterEach(() => {
    mock.restore();
  });

  test("convert", () => {
    process.env.SYNVERT_SNIPPETS_HOME = path.join(__dirname, "..");
    const libraryPath = path.join(process.env.SYNVERT_SNIPPETS_HOME, "lib", options.snippet + ".js");
    const rewriter = Synvert.evalSnippetSync(libraryPath);
    rewriter.processSync();
    expect(fs.readFileSync(snippetPath, "utf-8")).toEqual(output);
  });
};

const assertHelper = (options) => {
  const helperPath = options.path || "code.js";
  const { input, output } = options;

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
    const rewriter = new Synvert.Rewriter("group", "name", function () {
      this.configure({ parser: Synvert.Parser.TYPESCRIPT });
      this.withinFilesSync("*.{js,jsx}", function () {
        this.callHelperSync(options.helper, options.options);
      });
    });
    rewriter.processSync();
    expect(fs.readFileSync(helperPath, "utf-8")).toEqual(output);
  });
};

module.exports = { assertConvert, assertHelper };
