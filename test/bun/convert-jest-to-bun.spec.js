const snippet = "bun/convert-jest-to-bun";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  describe("replace @jest/globals with bun", () => {
    const input = `
      import { test } from "@jest/globals";
    `;

    const output = `
      import { test } from "bun:test";
    `;

    assertConvert({
      path: "test/foobar.spec.js",
      input,
      output,
      snippet,
      helpers: ["helpers/add-import"],
    });
  });

  describe("insert bun import", () => {
    const input = `
      describe("foo", () => {
        it("bar", () => {
          expect(true).toBe(true)
        });
      });
    `;

    const output = `
      import { describe, it, expect } from "bun:test";
      describe("foo", () => {
        it("bar", () => {
          expect(true).toBe(true)
        });
      });
    `;

    assertConvert({
      path: "test/foobar.spec.js",
      input,
      output,
      snippet,
      helpers: ["helpers/add-import"],
    });
  });

  describe("rename toThrowError to toThrow", () => {
    const input = `
      describe("foo", () => {
        it("bar", () => {
          expect(() => { foobar() }).toThrowError(new Error());
        });
      });
    `;

    const output = `
      import { describe, it, expect } from "bun:test";
      describe("foo", () => {
        it("bar", () => {
          expect(() => { foobar() }).toThrow(new Error());
        });
      });
    `;

    assertConvert({
      path: "test/foobar.spec.js",
      input,
      output,
      snippet,
      helpers: ["helpers/add-import"],
    });
  });
});
