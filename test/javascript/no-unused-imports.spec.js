require("../../lib/javascript/no-unused-imports");
const { assertConvert } = require("../utils");

describe("javascript/no-unused-imports", () => {
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
      snippet: "javascript/no-unused-imports",
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
      snippet: "javascript/no-unused-imports",
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
      snippet: "javascript/no-unused-imports",
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
      snippet: "javascript/no-unused-imports",
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
      snippet: "javascript/no-unused-imports",
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
      snippet: "javascript/no-unused-imports",
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
      snippet: "javascript/no-unused-imports",
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
      snippet: "javascript/no-unused-imports",
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
      snippet: "javascript/no-unused-imports",
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
      snippet: "javascript/no-unused-imports",
    });
  });

  describe("specifier is used in jsx element", () => {
    assertConvert({
      input: `
        import React from "react-bootstrap";
        import { Button } from "react-bootstrap";

        class Test extends React.Component {
          render() {
            return <Button />
          }
        }
      `,
      output: `
        import React from "react-bootstrap";
        import { Button } from "react-bootstrap";

        class Test extends React.Component {
          render() {
            return <Button />
          }
        }
      `,
      snippet: "javascript/no-unused-imports",
      path: "code.jsx",
    });
  });
});