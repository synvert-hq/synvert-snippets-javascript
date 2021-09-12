require("../../lib/javascript/no-useless-constructor");
const { assertConvert } = require("../utils");

describe("No Useless Constructor", () => {
  const input = `
    class A {
      constructor () {
      }
    }

    class B extends A {
      constructor (...args) {
        super(...args);
      }
    }
  `;

  const output = `
    class A {
    }

    class B extends A {
    }
  `;

  assertConvert({
    input,
    output,
    path: "code.js",
    snippet: "javascript/noUselessConstructor",
  });
});
