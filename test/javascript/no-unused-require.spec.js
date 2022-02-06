const snippet = "javascript/no-unused-require";
require(`../../lib/${snippet}`);
const { assertConvert } = require("../utils");

describe(snippet, () => {
  describe("all valid", () => {
    assertConvert({
      input: `
        const x = require("x");
        const { a, b } = require("y");
        const c = a() + b() + x();
      `,
      output: `
        const x = require("x");
        const { a, b } = require("y");
        const c = a() + b() + x();
      `,
      snippet,
    });
  });

  describe("first require is unused", () => {
    assertConvert({
      input: `
        const x = require("x");
        const { a, b } = require("y");
        const c = b() + x();
      `,
      output: `
        const x = require("x");
        const { b } = require("y");
        const c = b() + x();
      `,
      snippet,
    });
  });

  describe("last require is unused", () => {
    assertConvert({
      input: `
        const x = require("x");
        const { a, b } = require("y");
        const c = a() + x();
      `,
      output: `
        const x = require("x");
        const { a } = require("y");
        const c = a() + x();
      `,
      snippet,
    });
  });

  describe("all requires are unused", () => {
    assertConvert({
      input: `
        const x = require("x");
        const { a, b } = require("y");
        const c = x();
      `,
      output: `
        const x = require("x");
        const c = x();
      `,
      snippet,
    });
  });

  describe("default require is unused", () => {
    assertConvert({
      input: `
        const x = require("x");
        const { a, b } = require("y");
        const c = a() + b();
      `,
      output: `
        const { a, b } = require("y");
        const c = a() + b();
      `,
      snippet,
    });
  });
});
