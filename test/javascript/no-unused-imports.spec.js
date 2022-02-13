const snippet = "javascript/no-unused-imports";
require(`../../lib/${snippet}`);
const { assertConvert } = require("../utils");

describe(snippet, () => {
  describe("all valid", () => {
    assertConvert({
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
      snippet,
    });
  });

  describe("first specifier is unused", () => {
    assertConvert({
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
      snippet,
    });
  });

  describe("last specifier is unused", () => {
    assertConvert({
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
      snippet,
    });
  });

  describe("all specifiers are unused", () => {
    assertConvert({
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
      snippet,
    });
  });

  describe("all specifiers are unused 2", () => {
    assertConvert({
      input: `
        import c, { a, b } from "./utils";
        console.log(c);
      `,
      output: `
        import c from "./utils";
        console.log(c);
      `,
      snippet,
    });
  });

  describe("default specifier is unused", () => {
    assertConvert({
      input: `
        import { a, b } from "./utils";
        import y from "package";
        const c = a() + b;
      `,
      output: `
        import { a, b } from "./utils";
        const c = a() + b;
      `,
      snippet,
    });
  });

  describe("default specifier is unused 2", () => {
    assertConvert({
      input: `
        import y, { a, b } from "./utils";
        const c = a() + b;
      `,
      output: `
        import { a, b } from "./utils";
        const c = a() + b;
      `,
      snippet,
    });
  });

  describe("default specifier is unused 3", () => {
    assertConvert({
      input: `
        import y, * as p from "package";
        p.test();
      `,
      output: `
        import * as p from "package";
        p.test();
      `,
      snippet,
    });
  });

  describe("namespace specifier is unused", () => {
    assertConvert({
      input: `
        import * as p from "package";
        console.log("p");
      `,
      output: `
        console.log("p");
      `,
      snippet,
    });
  });

  describe("namespace specifier is unused 2", () => {
    assertConvert({
      input: `
        import y, * as p from "package";
        console.log(y);
      `,
      output: `
        import y from "package";
        console.log(y);
      `,
      snippet,
    });
  });

  describe("specifier is used in jsx element", () => {
    assertConvert({
      input: `
        import React, { Component } from "react-bootstrap";
        import { Button } from "react-bootstrap";

        class Test extends Component {
          render() {
            return <Button />
          }
        }
      `,
      output: `
        import React, { Component } from "react-bootstrap";
        import { Button } from "react-bootstrap";

        class Test extends Component {
          render() {
            return <Button />
          }
        }
      `,
      snippet,
      path: "code.jsx",
    });
  });
});
