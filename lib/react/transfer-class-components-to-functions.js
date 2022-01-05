const Synvert = require("synvert-core");

new Synvert.Rewriter("react", "transfer-class-components-to-functions", () => {
  description(`transfer react class components to functions`);

  const DEFAULT_INDENT = 2;

  withinFiles(Synvert.ALL_FILES, function () {
    withNode({ type: "ClassDeclaration", superClass: 'Component' }, () => {
      let functionBodyIndent = this.currentNode.loc.start.column;
      const functionBody = [];

      // this.state = { key: value };
      withNode({ type: "PropertyDefinition", key: "state" }, () => {
        this.currentNode.value.properties.forEach(property => {
          const name = property.key.name
          const value = property.value.toSource()
          functionBody.push(indent(`const [${name}, set${name.replace(/^\w/, (c) => c.toUpperCase())}] = useState(${value});`, DEFAULT_INDENT))
        });
      });

      // foo() => {}
      withNode({ type: "MethodDefinition", key: { not: "render" } }, () => {
        const name = this.currentNode.key.name;
        const value = this.currentNode.value.fixIndentToSource();
        functionBody.push(indent(`\nconst ${name} = ${value.replace('{', '=> {')}`, DEFAULT_INDENT))
      });

      // foo = () => {}
      withNode({ type: "PropertyDefinition", value: { type: "ArrowFunctionExpression" } }, () => {
        const name = this.currentNode.key.name;
        const value = this.currentNode.value.fixIndentToSource();
        functionBody.push(indent(`\nconst ${name} = ${value}`, DEFAULT_INDENT))
      });

      // render() {}
      withNode({ type: "MethodDefinition", key: "render" }, () => {
        const body = this.currentNode.value.body.body;
        functionBody.push(indent(body.fixIndentToSource(), DEFAULT_INDENT));
      });

      replaceWith(indent(`
const {{id}} = (props) => {
${functionBody.join("\n")}
}
      `.trim(), functionBodyIndent), { autoIndent: false });

      // this.props.name => props.name
      withNode({ type: "MemberExpression", object: 'this', property: 'props' }, () => {
        deleteNode(['object', 'dot']);
      });

      // this.state.name => name
      withNode({ type: "MemberExpression", object: { type: "MemberExpression", object: "this", property: "state" }}, () => {
        deleteNode(['object', 'dot'])
      });

      // this.setState(foo: 'bar') => setFoo('bar')
      withNode({ type: "CallExpression", callee: { type: "MemberExpression", object: "this", property: "setState" } }, () => {
        const properties = [];
        withNode({ type: 'ObjectExpression' }, () => {
          withNode({ type: 'Property' }, () => {
            properties.push({ name: this.currentNode.key.name, value: this.currentNode.value.toSource()});
          });
        });
        const useStateStatements = properties.map(({ name, value }) => `set${name.replace(/^\w/, (c) => c.toUpperCase())}(${value})`);
        replaceWith(useStateStatements.join("\n"));
      });
    });
  });
});
