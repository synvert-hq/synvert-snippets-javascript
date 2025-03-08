const snippet = "javascript/prefer-class-properties";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  describe("normal", () => {
    const input = `
      class Button extends Component {
        constructor(props) {
          super(props);
          this.state = { clicked: false };
          this.handleClick = this.handleClick.bind(this);
          this.handleSubmit = this.handleSubmit.bind(this);
          this.handleMouseOver = function () {
            console.log('handle mouse over')
          }
          this.handleMouseOut = () => {
            console.log('handle mouse out')
          }
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
      }
    `;

    const output = `
      class Button extends Component {
        constructor(props) {
          super(props);
          this.state = { clicked: false };
        }

        handleMouseOver = () => {
          console.log('handle mouse over')
        }

        handleMouseOut = () => {
          console.log('handle mouse out')
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
      }
    `;

    assertConvert({
      input,
      output,
      snippet,
    });
  });

  describe("async", () => {
    const input = `
      class Button {
        constructor(props) {
          this.state = { clicked: false };
          this.handleClick = this.handleClick.bind(this);
        }

        async handleClick() {
          this.setState({ clicked: true });
        }
      }
    `;

    const output = `
      class Button {
        constructor(props) {
          this.state = { clicked: false };
        }

        handleClick = async () => {
          this.setState({ clicked: true });
        }
      }
    `;

    assertConvert({
      input,
      output,
      snippet,
    });
  });
});
