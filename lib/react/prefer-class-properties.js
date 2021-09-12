const Synvert = require("synvert-core");

new Synvert.Rewriter("react", "preferClassProperties", () => {
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
      state = { clicked: false };

      handleClick = () => {
        this.setState({ clicked: true });
      }

      render() {
        return <button onClick={this.handleClick}>Click Me!</button>;
      }
    }
  `);

  addSnippet("javascript", "preferClassProperties");

  /**
   * move state to class property
   *
   * class Button extends Component {
   *   constructor(props) {
   *     super(props);
   *     this.state = { clicked: false };
   *   }
   * }
   *
   * =>
   *
   * class Button extends Component {
   *   state = { clicked: false };
   *   constructor(props) {
   *     super(props);
   *   }
   * }
   */
  withFiles("**/*.{js,jsx}", function () {
    withNode({ type: "ClassDeclaration" }, () => {
      let stateNode;
      withNode({ type: "MethodDefinition", kind: "constructor" }, () => {
        withNode(
          {
            type: "ExpressionStatement",
            expression: {
              type: "AssignmentExpression",
              left: { type: "MemberExpression", object: "this", property: "state" },
              right: { type: "ObjectExpression" },
            },
          },
          () => {
            if (this.currentNode.expression.right.properties.every(property => property.value.type === 'Literal')) {
              stateNode = this.currentNode;
              remove();
            }
          }
        );
      });
      if (stateNode) {
        prepend(stateNode.fixIndentToSource().replace("this.", ""));
      }
    });
  });

  addSnippet("javascript", "noUselessConstructor");
});
