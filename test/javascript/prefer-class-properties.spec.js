require("../../lib/javascript/prefer-class-properties");
const { assertConvert } = require('../utils');

describe("Prefer class properties", () => {
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
        this.handleClick = this.handleClick.bind(this);
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
    snippet: "javascript/preferClassProperties"
  });
});
