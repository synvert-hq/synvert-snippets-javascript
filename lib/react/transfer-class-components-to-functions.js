const Synvert = require("synvert-core");

new Synvert.Rewriter("react", "transfer-class-components-to-functions", () => {
  description(`transfer react class components to functions`);

  withinFiles(Synvert.ALL_FILES, function () {
    withNode({ type: "ClassDeclaration", superClass: { object: "React", property: "Component" } }, () => {
      let renderBody;
      withNode({ type: "MethodDefinition", key: "render" }, () => {
        const body = this.currentNode.value.body.body;
        renderBody = body.toSource();
        if (body.first().loc.start.line != body.last().loc.end.line) {
          renderBody = " ".repeat(body.first().loc.start.column) + renderBody;
        }
      });

      const states = [];
      withNode({ type: "PropertyDefinition", key: "state" }, () => {
        this.currentNode.value.properties.forEach((property) =>
          states.push({
            name: property.key.name,
            value: property.value.value,
          })
        );
      });
      const functionBody = [];
      states.forEach(({ name, value }) =>
        functionBody.push(`const [${name}, set${name.replace(/^\w/, (c) => c.toUpperCase())}] = useState(${value});`)
      );
      functionBody.push(renderBody);
      if (states.length > 0) {
        functionBody.splice(states.length, 0, "");
      }
      replaceWith(`
        const {{id}} = (props) => {
          ${functionBody.join("\n")}
        }
      `);

      withNode({ type: "MemberExpression", object: "this", property: "props" }, () => {
        deleteNode(["object", "dot"]);
      });

      withNode(
        { type: "MemberExpression", object: { type: "MemberExpression", object: "this", property: "state" } },
        () => {
          deleteNode(["object", "dot"]);
        }
      );

      withNode(
        { type: "CallExpression", callee: { type: "MemberExpression", object: "this", property: "setState" } },
        () => {
          const properties = [];
          withNode({ type: "ObjectExpression" }, () => {
            withNode({ type: "Property" }, () => {
              properties.push({ name: this.currentNode.key.name, value: this.currentNode.value.toSource() });
            });
          });
          const useStateStatements = properties.map(
            ({ name, value }) => `set${name.replace(/^\w/, (c) => c.toUpperCase())}(${value})`
          );
          replaceWith(useStateStatements.join("\n"));
        }
      );
    });
  });
});
