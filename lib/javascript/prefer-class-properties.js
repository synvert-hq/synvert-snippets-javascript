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

      // constructor() {
      //   this.foo = function() {}
      //   this.bar = () => {}
      // }
      // =>
      // constructor() {
      // }
      // foo = () => {}
      // bar = () => {}
      withNode({ type: "MethodDefinition", key: 'constructor' }, function () {
        const constructorIndent = this.currentNode.loc.start.column;
        const functions = [];
        withNode({ type: "AssignmentExpression", left: { type: "MemberExpression", object: "this" }, right: { type: "FunctionExpression" } }, () => {
          functions.push(this.currentNode);
          remove();
        });

        const arrowFunctions = [];
        withNode({ type: "AssignmentExpression", left: { type: "MemberExpression", object: "this" }, right: { type: "ArrowFunctionExpression" } }, function () {
          arrowFunctions.push(this.currentNode);
          remove();
        });

        functions.forEach(func => {
          const source = indent(`${func.left.property.name} = ${func.right.fixIndentToSource()}`, constructorIndent);
          insert(`\n\n${source.replace(/function ?/, '').replace(/\) {/, ') => {')}`, { at: 'end' });
        })

        arrowFunctions.forEach(arrowFunction => {
          const source = indent(`${arrowFunction.left.property.name} = ${arrowFunction.right.fixIndentToSource()}`, constructorIndent);
          insert(`\n\n${source}`, { at: 'end' });
        });
      });

      // handleChange() {}
      // =>
      // handleChange = () => {}
      withNode({ type: "MethodDefinition", key: { notIn: ignoreMethods }, value: { async: false } }, () => {
        insert(" = ", { to: 'key', at: "end" });
        insert("=> ", { to: 'value.body', at: "beginning" });
      });

      // async handleChange() {}
      // =>
      // async handleChange = () => {}
      withNode({ type: "MethodDefinition", key: { notIn: ignoreMethods }, value: { async: true } }, () => {
        deleteNode("async");
        insert(" = async ", { to: 'key', at: "end" });
        insert("=> ", { to: 'value.body', at: "beginning" });
      });
    });
  });
});
