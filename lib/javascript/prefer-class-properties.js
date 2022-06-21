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

  const ignoreMethods = this.options.ignoreMethods || ["constructor"];

  withinFiles(Synvert.ALL_FILES, () => {
    findNode(".ClassDeclaration", () => {
      findNode(
        `.AssignmentExpression[left=.MemberExpression[object=this]]
                  [right=.CallExpression
                    [callee=.MemberExpression
                      [object=.MemberExpression[object=this]][property=bind]]
                    [arguments.length=1][arguments.first=this]]
                  [left.property={{right.callee.object.property}}]`,
        () => {
          remove();
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
      findNode(".MethodDefinition[key=constructor]", function () {
        const constructorIndent = this.currentNode.loc.start.column;
        const functions = [];
        findNode(".AssignmentExpression[left=.MemberExpression[object=this]][right=.FunctionExpression]", () => {
          functions.push(this.currentNode);
          remove();
        });

        const arrowFunctions = [];
        findNode(".AssignmentExpression[left=.MemberExpression[object=this]][right=.ArrowFunctionExpression]", () => {
          arrowFunctions.push(this.currentNode);
          remove();
        });

        functions.forEach((func) => {
          const source = indent(
            `${func.left.property.name} = ${func.right.toSource({ fixIndent: true })}`,
            constructorIndent
          );
          insert(`\n\n${source.replace(/function ?/, "").replace(/\) {/, ") => {")}`, { at: "end" });
        });

        arrowFunctions.forEach((arrowFunction) => {
          const source = indent(
            `${arrowFunction.left.property.name} = ${arrowFunction.right.toSource({ fixIndent: true })}`,
            constructorIndent
          );
          insert(`\n\n${source}`, { at: "end" });
        });
      });

      // handleChange() {}
      // =>
      // handleChange = () => {}
      findNode(`.MethodDefinition[key NOT IN (${ignoreMethods.join(" ")})][value.async=false]`, () => {
        insert(" = ", { to: "key", at: "end" });
        insert("=> ", { to: "value.body", at: "beginning" });
      });

      // async handleChange() {}
      // =>
      // async handleChange = () => {}
      findNode(`.MethodDefinition[key NOT IN (${ignoreMethods.join(" ")})][value.async=true]`, () => {
        deleteNode("async");
        insert(" = async ", { to: "key", at: "end" });
        insert("=> ", { to: "value.body", at: "beginning" });
      });
    });
  });
});
