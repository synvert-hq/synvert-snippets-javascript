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

    class Button extends Component {
      constructor(props) {
        super(props)
      }
    }
  `;

  const output = `
    class A {
    }

    class B extends A {
    }

    class Button extends Component {
    }
  `;

  assertConvert({
    input,
    output,
    path: "code.js",
    snippet: "javascript/noUselessConstructor",
  });
});
