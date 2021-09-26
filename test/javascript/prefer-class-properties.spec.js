require("../../lib/javascript/prefer-class-properties");
const { assertConvert } = require("../utils");

describe("javascript/prefer-class-properties", () => {
  describe("normal", () => {
    const input = `
      class Button extends Component {
        constructor(props) {
          super(props);
          this.state = { clicked: false };
          this.handleClick = this.handleClick.bind(this);
        }

        handleClick() {
          this.setState({ clicked: true });
        }

        render() {
          return <button onClick={this.handleClick}>Click Me!</button>;
        }
      }
    `;

    const output = `
      class Button extends Component {
        constructor(props) {
          super(props);
          this.state = { clicked: false };
        }

        handleClick = () => {
          this.setState({ clicked: true });
        }

        render() {
          return <button onClick={this.handleClick}>Click Me!</button>;
        }
      }
    `;

    assertConvert({
      input,
      output,
      path: "code.jsx",
      snippet: "javascript/prefer-class-properties",
    });
  });

  describe("async", () => {
    const input = `
      class Button extends Component {
        constructor(props) {
          super(props);
          this.state = { clicked: false };
          this.handleClick = this.handleClick.bind(this);
        }

        async handleClick() {
          this.setState({ clicked: true });
        }

        render() {
          return <button onClick={this.handleClick}>Click Me!</button>;
        }
      }
    `;

    const output = `
      class Button extends Component {
        constructor(props) {
          super(props);
          this.state = { clicked: false };
        }

        handleClick = async () => {
          this.setState({ clicked: true });
        }

        render() {
          return <button onClick={this.handleClick}>Click Me!</button>;
        }
      }
    `;

    assertConvert({
      input,
      output,
      path: "code.jsx",
      snippet: "javascript/prefer-class-properties",
    });
  });
});
