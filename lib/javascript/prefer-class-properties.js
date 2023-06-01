new Synvert.Rewriter("javascript", "prefer-class-properties", function () {
  description(`
    Prefer class prroperties.

    \`\`\`javascript
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
    \`\`\`

    =>

    \`\`\`javascript
    class Button extends Component {
      constructor(props) {
        super(props);
        this.state = { clicked: false };
      }

      handleClick = () => {
        this.setState({ clicked: true });
      }
    }
    \`\`\`
  `);

  const ignoreMethods = ["constructor"];

  configure({ parser: Synvert.Parser.TYPESCRIPT, strategy: Synvert.Strategy.ALLOW_INSERT_AT_SAME_POSITION });

  withinFiles(Synvert.ALL_FILES, () => {
    findNode(".ClassDeclaration", () => {
      // remove this.handleClick = this.handleClick.bind(this)
      findNode(
        `.BinaryExpression
          [left=.PropertyAccessExpression[expression=.ThisKeyword]]
          [right=.CallExpression
            [expression=.PropertyAccessExpression
              [expression=.PropertyAccessExpression
                [expression=.ThisKeyword]]
              [name=bind]]
            [arguments.length=1]
            [arguments.0=.ThisKeyword]]
          [left.name="{{right.expression.expression.name}}"]`,
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
      findNode(".Constructor", function () {
        const constructorIndent = this.mutationAdapter.getStartLoc(this.currentNode).column;
        const functions = [];
        findNode(
          ".BinaryExpression[left=.PropertyAccessExpression[expression=.ThisKeyword]][right=.FunctionExpression]",
          () => {
            functions.push(this.currentNode);
            remove();
          }
        );

        const arrowFunctions = [];
        findNode(
          ".BinaryExpression[left=.PropertyAccessExpression[expression=.ThisKeyword]][right=.ArrowFunction]",
          () => {
            arrowFunctions.push(this.currentNode);
            remove();
          }
        );

        functions.forEach((func) => {
          const source = indent(
            `${this.mutationAdapter.getSource(func.left.name)} = ${this.mutationAdapter.getSource(func.right, {
              fixIndent: true,
            })}`,
            constructorIndent
          );
          insert(`\n\n${source.replace(/function ?/, "").replace(/\) {/, ") => {")}`, { at: "end" });
        });

        arrowFunctions.forEach((arrowFunction) => {
          const source = indent(
            `${this.mutationAdapter.getSource(arrowFunction.left.name)} = ${this.mutationAdapter.getSource(
              arrowFunction.right,
              { fixIndent: true }
            )}`,
            constructorIndent
          );
          insert(`\n\n${source}`, { at: "end" });
        });
      });

      // handleChange() {}
      // =>
      // handleChange = () => {}
      findNode(`.MethodDeclaration[name NOT IN (${ignoreMethods.join(" ")})][modifiers=undefined]`, () => {
        insert(" = ", { to: "name", at: "end" });
        insert("=> ", { to: "body", at: "beginning" });
      });

      // async handleChange() {}
      // =>
      // async handleChange = () => {}
      findNode(`.MethodDeclaration[name NOT IN (${ignoreMethods.join(" ")})][modifiers.0=.AsyncKeyword]`, () => {
        // prettier-ignore
        delete("modifiers");
        insert(" = async ", { to: "name", at: "end" });
        insert("=> ", { to: "body", at: "beginning" });
      });
    });
  });
});
