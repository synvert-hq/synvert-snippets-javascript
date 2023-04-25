const fs = require("fs");
const promisesFs = require("fs/promises");
const path = require("path");
const mock = require("mock-fs");
const Synvert = require("synvert-core");

process.env.SYNVERT_SNIPPETS_HOME = path.join(__dirname, "..");
const SYNVERT_CODE_HOME = path.join(__dirname, "..", "src");
Synvert.Configuration.rootPath = SYNVERT_CODE_HOME.toString();

const otherSnippetsMockSync = (options) => {
  const mocks = {};
  if (options) {
    options.forEach((option) => {
      const libraryPath = path.join(process.env.SYNVERT_SNIPPETS_HOME, "lib", option + ".js");
      const content = fs.readFileSync(libraryPath, "utf-8");
      mocks[libraryPath] = content;
    });
  }
  return mocks;
};

const otherSnippetsMock = async (options) => {
  const mocks = {};
  if (options) {
    for await (const option of options) {
      const libraryPath = path.join(process.env.SYNVERT_SNIPPETS_HOME, "lib", option + ".js");
      const content = await promisesFs.readFile(libraryPath, "utf-8");
      mocks[libraryPath] = content;
    }
  }
  return mocks;
};

const assertConvert = (options) => {
  const snippetPath = path.join(SYNVERT_CODE_HOME, options.path || "code.js");
  const { input, output } = options;

  if (process.env.SYNC === "true") {
    beforeEach(() => {
      const libraryPath = path.join(process.env.SYNVERT_SNIPPETS_HOME, "lib", options.snippet + ".js");
      const libraryContent = fs.readFileSync(libraryPath, "utf-8");
      mock({
        [libraryPath]: libraryContent,
        [snippetPath]: input,
        ...otherSnippetsMockSync(options.helpers),
        ...otherSnippetsMockSync(options.subSnippets),
      });
    });

    afterEach(() => {
      mock.restore();
    });

    test("convert", () => {
      const libraryPath = path.join(process.env.SYNVERT_SNIPPETS_HOME, "lib", options.snippet + ".js");
      const rewriter = Synvert.evalSnippetSync(libraryPath);
      rewriter.processSync();
      expect(fs.readFileSync(snippetPath, "utf-8")).toEqual(output);
    });
  } else {
    beforeEach(async () => {
      const libraryPath = path.join(process.env.SYNVERT_SNIPPETS_HOME, "lib", options.snippet + ".js");
      const libraryContent = await promisesFs.readFile(libraryPath, "utf-8");
      mock({
        [libraryPath]: libraryContent,
        [snippetPath]: input,
        ...(await otherSnippetsMock(options.helpers)),
        ...(await otherSnippetsMock(options.subSnippets)),
      });
    });

    afterEach(() => {
      mock.restore();
    });

    test("convert", async () => {
      const libraryPath = path.join(process.env.SYNVERT_SNIPPETS_HOME, "lib", options.snippet + ".js");
      const rewriter = await Synvert.evalSnippet(libraryPath);
      await rewriter.process();
      expect(await promisesFs.readFile(snippetPath, "utf-8")).toEqual(output);
    });
  }
};

const assertHelper = (options) => {
  const helperPath = path.join(SYNVERT_CODE_HOME, options.path || "code.js");
  const { input, output } = options;

  if (process.env.SYNC === "true") {
    beforeEach(() => {
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
  } else {
    beforeEach(async () => {
      const helperLibraryPath = path.join(process.env.SYNVERT_SNIPPETS_HOME, "lib", options.helper + ".js");
      const helperContent = await promisesFs.readFile(helperLibraryPath, "utf-8");
      mock({
        [helperLibraryPath]: helperContent,
        [helperPath]: input,
      });
    });

    afterEach(() => {
      mock.restore();
    });

    test("convert", async () => {
      const rewriter = new Synvert.Rewriter("group", "name", async function () {
        this.configure({ parser: Synvert.Parser.TYPESCRIPT });
        await this.withinFiles("*.{js,jsx}", async function () {
          await this.callHelper(options.helper, options.options);
        });
      });
      await rewriter.process();
      expect(await promisesFs.readFile(helperPath, "utf-8")).toEqual(output);
    });
  }
};

module.exports = { assertConvert, assertHelper };
