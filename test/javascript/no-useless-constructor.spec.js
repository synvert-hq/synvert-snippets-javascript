const snippet = "javascript/no-useless-constructor";
const { assertConvert } = require("../utils");

describe(snippet, () => {
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
    snippet,
    path: "code.js",
  });
});
