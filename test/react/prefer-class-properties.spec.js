require("../../lib/javascript/prefer-class-properties");
require("../../lib/javascript/no-useless-constructor");
require("../../lib/react/prefer-class-properties");
const { assertConvert } = require("../utils");

describe("react/prefer-react-class-properties", () => {
  const input = `
    class Button extends Component {
      constructor(props) {
        super(props);
        this.state = {
          clicked: false,
          submitted: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      componentDidMount() {
        console.log('did mount');
      }

      handleClick() {
        this.setState({ clicked: true });
      }

      handleSubmit() {
        this.setState({ submitted: true });
      }

      handleChange() {
        this.setState({ changed: true });
      }

      render() {
        return <button onClick={this.handleClick}>Click Me!</button>;
      }
    }
  `;

  const output = `
    class Button extends Component {
      state = {
        clicked: false,
        submitted: false
      };

      componentDidMount() {
        console.log('did mount');
      }

      handleClick = () => {
        this.setState({ clicked: true });
      }

      handleSubmit = () => {
        this.setState({ submitted: true });
      }

      handleChange = () => {
        this.setState({ changed: true });
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
    snippet: "react/prefer-class-properties",
  });
});
