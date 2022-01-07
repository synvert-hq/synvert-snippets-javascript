const Synvert = require("synvert-core");

new Synvert.Rewriter("react", "transfer-class-components-to-functions", () => {
  description(`transfer react class components to functions`);

  const DEFAULT_INDENT = 2;

  withinFiles(Synvert.ALL_FILES, function () {
    withNode({ type: "ClassDeclaration", superClass: 'Component' }, () => {
      let functionBodyIndent = this.currentNode.loc.start.column;
      const functionBody = [];
      const thisMethods = [];

      // this.state = { key: value };
      withNode({ type: "PropertyDefinition", key: "state" }, () => {
        this.currentNode.value.properties.forEach(property => {
          const name = property.key.name
          const value = property.value.toSource()
          functionBody.push(indent(`const [${name}, set${name.replace(/^\w/, (c) => c.toUpperCase())}] = useState(${value});\n`, DEFAULT_INDENT))
        });
      });

      // foo() => {}
      withNode({ type: "MethodDefinition", key: { not: "render" } }, () => {
        const name = this.currentNode.key.name;
        const value = this.currentNode.value.fixIndentToSource();
        functionBody.push(indent(`const ${name} = ${value.replace('{', '=> {')}\n`, DEFAULT_INDENT))
        thisMethods.push(name);
      });

      // foo = () => {}
      withNode({ type: "PropertyDefinition", value: { type: "ArrowFunctionExpression" } }, () => {
        const name = this.currentNode.key.name;
        const value = this.currentNode.value.fixIndentToSource();
        functionBody.push(indent(`const ${name} = ${value}\n`, DEFAULT_INDENT))
        thisMethods.push(name);
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

      // <div onClick={this.clickHandler} />
      // =>
      // <div onClick={clickHandler} />
      withNode({ type: "MemberExpression", object: "this", property: { in: thisMethods } }, () => {
        deleteNode(['object', 'dot']);
      });

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

    ifExistNode({ type: "CallExpression", callee: { type: "MemberExpression", object: "this", property: "setState" } }, () => {
      // import React, { Component } from 'react'
      // =>
      // import React, { Component, useState } from 'react'
      withNode({ type: "ImportDeclaration", source: { value: "react" }, specifiers: { first: { type: "ImportDefaultSpecifier", local: "React" } } }, () => {
        unlessExistNode({ type: "ImportSpecifier", local: "useState" }, () => {
          withNode({ type: "ImportSpecifier", local: "Component" }, () => {
            insert(", useState", { at: 'end' });
          });
        });
      });
    });

    // import React, { Component } from 'react'
    // =>
    // import React from 'react'
    withNode({ type: "ImportSpecifier", local: "Component" }, () => {
      remove();
    });
  });
});
