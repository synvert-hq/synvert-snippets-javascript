const fs = require("fs");
const mock = require("mock-fs");
const Synvert = require("synvert-core");
require("../../lib/javascript/prefer-class-properties");

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
  beforeEach(() => {
    mock({ "code.jsx": input });
  });
  afterEach(() => {
    mock.restore();
  });

  test("convert", () => {
    const rewriter = Synvert.Rewriter.fetch("javascript", "preferClassProperties");
    rewriter.process();
    expect(fs.readFileSync("code.jsx", "utf-8")).toEqual(output);
  });
});
