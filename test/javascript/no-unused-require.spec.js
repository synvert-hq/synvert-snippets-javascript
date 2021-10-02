require("../../lib/javascript/no-unused-require");
const { assertConvert } = require("../utils");

describe("javascript/no-unused-require", () => {
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
      snippet: "javascript/no-unused-require",
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
      snippet: "javascript/no-unused-require",
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
      snippet: "javascript/no-unused-require",
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
      snippet: "javascript/no-unused-require",
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
      snippet: "javascript/no-unused-require",
    });
  });
});