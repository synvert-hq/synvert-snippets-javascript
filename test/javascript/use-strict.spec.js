const fs = require("fs");
const mock = require("mock-fs");
const Synvert = require("synvert-core");
require("../../lib/javascript/use-strict");

describe("Use strict", () => {
  describe("exists", () => {
    const input = `'use strict'\nfoobar`;
    const output = `'use strict'\nfoobar`;
    beforeEach(() => {
      mock({ "code.js": input });
    });
    afterEach(() => {
      mock.restore();
    });

    test("convert", () => {
      const rewriter = Synvert.Rewriter.fetch("javascript", "useStrict");
      rewriter.process();
      expect(fs.readFileSync("code.js", "utf-8")).toEqual(output);
    });
  });

  describe("does not exist", () => {
    const input = `foobar`;
    const output = `'use strict'\nfoobar`;
    beforeEach(() => {
      mock({ "code.js": input });
    });
    afterEach(() => {
      mock.restore();
    });

    test("convert", () => {
      const rewriter = Synvert.Rewriter.fetch("javascript", "useStrict");
      rewriter.process();
      expect(fs.readFileSync("code.js", "utf-8")).toEqual(output);
    });
  });
});
