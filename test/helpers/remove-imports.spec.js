const helper = "helpers/remove-imports";
const { assertHelper } = require("../utils");

describe("helpers/remove-imports", () => {
  describe("all valid", () => {
    assertHelper({
      input: `
        import x from "package";
        import { a, b } from "./utils";
        import y from "package";
        const c = a() + b + x() + y();
      `,
      output: `
        import x from "package";
        import { a, b } from "./utils";
        import y from "package";
        const c = a() + b + x() + y();
      `,
      helper,
      options: { importNames: [] },
    });
  });

  describe("first specifier is unused", () => {
    assertHelper({
      input: `
        import x from "package";
        import { a, b } from "./utils";
        import y from "package";
        const c = b(x, y);
      `,
      output: `
        import x from "package";
        import { b } from "./utils";
        import y from "package";
        const c = b(x, y);
      `,
      helper,
      options: { importNames: ["a"] },
    });
  });

  describe("last specifier is unused", () => {
    assertHelper({
      input: `
        import { a, b } from "./utils";
        import y from "package";
        /**
         * this is a jsdoc!
         */
        const c = a(y);
      `,
      output: `
        import { a } from "./utils";
        import y from "package";
        /**
         * this is a jsdoc!
         */
        const c = a(y);
      `,
      helper,
      options: { importNames: ["b"] },
    });
  });

  describe("all specifiers are unused", () => {
    assertHelper({
      input: `
        import { a, b } from "./utils";
        import y from "package";
        const c = 4;
        console.log(y);
      `,
      output: `
        import y from "package";
        const c = 4;
        console.log(y);
      `,
      helper,
      options: { importNames: ["a", "b"] },
    });
  });

  describe("all specifiers are unused 2", () => {
    assertHelper({
      input: `
        import c, { a, b } from "./utils";
        console.log(c);
      `,
      output: `
        import c from "./utils";
        console.log(c);
      `,
      helper,
      options: { importNames: ["a", "b"] },
    });
  });

  describe("default specifier is unused", () => {
    assertHelper({
      input: `
        import { a, b } from "./utils";
        import y from "package";
        const c = a() + b;
      `,
      output: `
        import { a, b } from "./utils";
        const c = a() + b;
      `,
      helper,
      options: { importNames: ["y"] },
    });
  });

  describe("default specifier is unused 2", () => {
    assertHelper({
      input: `
        import y, { a, b } from "./utils";
        const c = a() + b;
      `,
      output: `
        import { a, b } from "./utils";
        const c = a() + b;
      `,
      helper,
      options: { importNames: ["y"] },
    });
  });

  describe("default specifier is unused 3", () => {
    assertHelper({
      input: `
        import y, * as p from "package";
        p.test();
      `,
      output: `
        import * as p from "package";
        p.test();
      `,
      helper,
      options: { importNames: ["y"] },
    });
  });

  describe("namespace specifier is unused", () => {
    assertHelper({
      input: `
        import * as p from "package";
        console.log("p");
      `,
      output: `
        console.log("p");
      `,
      helper,
      options: { importNames: ["p"] },
    });
  });

  describe("namespace specifier is unused 2", () => {
    assertHelper({
      input: `
        import y, * as p from "package";
        console.log(y);
      `,
      output: `
        import y from "package";
        console.log(y);
      `,
      helper,
      options: { importNames: ["p"] },
    });
  });
});
