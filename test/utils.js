const fs = require("fs");
const promisesFs = require("fs/promises");
const path = require("path");
const Synvert = require("@synvert-hq/synvert-core");

process.env.SYNVERT_SNIPPETS_HOME = path.join(__dirname, "..");
const SYNVERT_CODE_HOME = path.join(__dirname, "..", "tmp");
Synvert.Configuration.rootPath = SYNVERT_CODE_HOME.toString();
Synvert.Configuration.respectGitignore = false;

const getCodePath = (options) => {
  if (options.path) {
    return path.join(SYNVERT_CODE_HOME, options.path);
  }

  switch (options.snippet.split("/")[0]) {
    case "scss":
      return path.join(SYNVERT_CODE_HOME, options.snippet + '.scss');
    case "sass":
      return path.join(SYNVERT_CODE_HOME, options.snippet + '.sass');
    case "css":
      return path.join(SYNVERT_CODE_HOME, options.snippet + '.css');
    case "typescript":
      return path.join(SYNVERT_CODE_HOME, options.snippet + '.ts');
    case "react":
      return path.join(SYNVERT_CODE_HOME, options.snippet + '.jsx');
    default:
      return path.join(SYNVERT_CODE_HOME, options.snippet + '.js');
  }
}

const getNewCodePath = (options) => {
  if (options.newPath) {
    return path.join(SYNVERT_CODE_HOME, options.newPath);
  }

  return getCodePath(options);
}

const assertConvert = (options) => {
  const codePath = getCodePath(options);
  const { input, output } = options;

  if (process.env.SYNC === "true") {
    beforeEach(() => {
      fs.mkdirSync(path.dirname(codePath), { recursive: true });
      fs.writeFileSync(codePath, input);
    });

    afterEach(() => {
      fs.unlinkSync(getNewCodePath(options));
    });

    test("convert", () => {
      const rewriter = Synvert.evalSnippetSync(options.snippet);
      rewriter.processSync();
      if (options.newPath) {
        expect(fs.readFileSync(path.join(SYNVERT_CODE_HOME, options.newPath), "utf-8")).toEqual(output);
      } else {
        expect(fs.readFileSync(codePath, "utf-8")).toEqual(output);
      }
    });
  } else {
    beforeEach(async () => {
      await promisesFs.mkdir(path.dirname(codePath), { recursive: true });
      await promisesFs.writeFile(codePath, input);
    });

    afterEach(async () => {
      await promisesFs.unlink(getNewCodePath(options));
    });

    test("convert", async () => {
      const rewriter = await Synvert.evalSnippet(options.snippet);
      await rewriter.process();
      if (options.newPath) {
        expect(await promisesFs.readFile(path.join(SYNVERT_CODE_HOME, options.newPath), "utf-8")).toEqual(output);
      } else {
        expect(await promisesFs.readFile(codePath, "utf-8")).toEqual(output);
      }
    });
  }
};

const assertHelper = (options) => {
  const helperPath = path.join(SYNVERT_CODE_HOME, options.helper + '.js');
  const { input, output } = options;

  if (process.env.SYNC === "true") {
    beforeEach(() => {
      fs.mkdirSync(path.dirname(helperPath), { recursive: true });
      fs.writeFileSync(helperPath, input);
    });

    afterEach(() => {
      fs.unlinkSync(helperPath);
    });

    test("convert", () => {
      const rewriter = new Synvert.Rewriter("group", "name", function () {
        this.configure({ parser: Synvert.Parser.TYPESCRIPT });
        this.withinFilesSync(Synvert.ALL_FILES, function () {
          this.callHelperSync(options.helper, options.options);
        });
      });
      rewriter.processSync();
      expect(fs.readFileSync(helperPath, "utf-8")).toEqual(output);
    });
  } else {
    beforeEach(async () => {
      await promisesFs.mkdir(path.dirname(helperPath), { recursive: true });
      await promisesFs.writeFile(helperPath, input);
    });

    afterEach(async () => {
      await promisesFs.unlink(helperPath);
    });

    test("convert", async () => {
      const rewriter = new Synvert.Rewriter("group", "name", async function () {
        this.configure({ parser: Synvert.Parser.TYPESCRIPT });
        await this.withinFiles(Synvert.ALL_FILES, async function () {
          await this.callHelper(options.helper, options.options);
        });
      });
      await rewriter.process();
      expect(await promisesFs.readFile(helperPath, "utf-8")).toEqual(output);
    });
  }
};

module.exports = { assertConvert, assertHelper };
