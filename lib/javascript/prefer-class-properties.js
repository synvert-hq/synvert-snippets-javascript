const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "prefer-class-properties", function () {
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
    }
  `);

  const ignoreMethods = this.options.ignoreMethods || ['constructor'];

  withinFiles(Synvert.ALL_FILES, () => {
    withNode({ type: "ClassDeclaration" }, () => {
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
            remove();
          }
        }
      );

      withNode({ type: "MethodDefinition", key: { notIn: ignoreMethods }, value: { async: false } }, function () {
        insert(" = ", { to: 'key', at: "end" });
        insert("=> ", { to: 'value.body', at: "beginning" });
      });

      withNode({ type: "MethodDefinition", key: { notIn: ignoreMethods }, value: { async: true } }, function () {
        deleteNode("async");
        insert(" = async ", { to: 'key', at: "end" });
        insert("=> ", { to: 'value.body', at: "beginning" });
      });
    });
  });
});
