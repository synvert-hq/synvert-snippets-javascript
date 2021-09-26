const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "prefer-class-properties", () => {
  description(`
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
    =>
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
  `);

  withinFiles("**/*.{js,jsx}", () => {
    withNode({ type: "ClassDeclaration" }, () => {
      const bindProperties = [];
      withNode({ type: "MethodDefinition", kind: "constructor" }, () => {
        withNode(
          {
            type: "AssignmentExpression",
            left: { type: "MemberExpression", object: "this" },
            right: {
              type: "CallExpression",
              callee: { object: { type: "MemberExpression", object: "this" }, property: "bind" },
              arguments: { length: 1, first: "this" },
            },
          },
          function () {
            if (this.currentNode.left.property.name == this.currentNode.right.callee.object.property.name) {
              bindProperties.push(this.currentNode.left.property.name);
              remove();
            }
          }
        );
      });
      bindProperties.forEach((property) => {
        withNode({ type: "MethodDefinition", key: property, value: { async: false } }, function () {
          gotoNode("key", () => {
            insert(" = ", { at: "end" });
          });
          gotoNode("value.body", () => {
            insert("=> ", { at: "beginning" });
          });
        });

        withNode({ type: "MethodDefinition", key: property, value: { async: true } }, function () {
          deleteNode("async");
          gotoNode("key", () => {
            insert(" = async ", { at: "end" });
          });
          gotoNode("value.body", () => {
            insert("=> ", { at: "beginning" });
          });
        });
      });
    });
  });
});
