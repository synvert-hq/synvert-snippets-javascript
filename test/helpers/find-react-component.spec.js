const helper = "helpers/find-react-component";
const { assertHelper } = require("../utils");

describe("helpers/find-react-component", () => {
  const source = `
    const MyComponent = () => {
      return <div>My Component</div>;
    };

    export default MyComponent;
  `;
  assertHelper({
    input: source,
    output: source,
    helper,
    options: {},
    helperFn: function () {
      expect(this.currentNode.name.escapedText).toEqual("MyComponent");
    },
  });
});
