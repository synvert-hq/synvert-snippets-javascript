require("../../lib/react/transfer-class-components-to-functions");
const { assertConvert } = require("../utils");

describe("react/transfer-class-components-to-functions", () => {
  describe("simple compoment", () => {
    const input = `
      class MyComponent extends Component {
        render() {
          return <p>It works!</p>;
        }
      }
    `;

    const output = `
      const MyComponent = (props) => {
        return <p>It works!</p>;
      }
    `;

    assertConvert({
      input,
      output,
      path: "code.jsx",
      snippet: "react/transfer-class-components-to-functions",
    });
  });

  describe("this.props", () => {
    const input = `
      class MyComponent extends Component {
        render() {
          return <p>Hi, {this.props.name}</p>;
        }
      }
    `;

    const output = `
      const MyComponent = (props) => {
        return <p>Hi, {props.name}</p>;
      }
    `;

    assertConvert({
      input,
      output,
      path: "code.jsx",
      snippet: "react/transfer-class-components-to-functions",
    });
  });

  describe("this.state", () => {
    const input = `
      class MyComponent extends Component {
        state = { count: 0 };

        render() {
          const reset = () => this.setState({ count: 0 });
          const inc = () => this.setState({ count: this.state.count + 1 });
          return <p onClick={inc}>
            Total: {this.state.count}
          </p>;
        }
      }
    `;

    const output = `
      const MyComponent = (props) => {
        const [count, setCount] = useState(0);
        const reset = () => setCount(0);
        const inc = () => setCount(count + 1);
        return <p onClick={inc}>
          Total: {count}
        </p>;
      }
    `;

    assertConvert({
      input,
      output,
      path: "code.jsx",
      snippet: "react/transfer-class-components-to-functions",
    });
  });

  describe("other functions", () => {
    const input = `
      class MyComponent extends Component {
        state = { hover: false };

        mouseEnterHandler() {
          this.setState({ hover: true });
        }

        mouseLeaveHandler = () => {
          this.setState({ hover: false });
        }
      }
    `;

    const output = `
      const MyComponent = (props) => {
        const [hover, setHover] = useState(false);

        const mouseEnterHandler = () => {
          setHover(true);
        }

        const mouseLeaveHandler = () => {
          setHover(false);
        }
      }
    `;

    assertConvert({
      input,
      output,
      path: "code.jsx",
      snippet: "react/transfer-class-components-to-functions",
    });
  });
});
