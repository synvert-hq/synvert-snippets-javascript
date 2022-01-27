const Synvert = require("synvert-core");

new Synvert.Rewriter("react", "transfer-class-components-to-functions", () => {
  description(`transfer react class components to functions`);

  const DEFAULT_INDENT = 2;
  const lifecycleMethods = [
    'componentDidMount',
    'componentDidUpdate',
    'componentWillReceiveProps',
    'componentWillUnmount',
    'componentDidCatch',
    'shouldComponentUpdate'
  ];

  const convertedFiles = {};
  const defaultOptions = { thisMethods: [], thisProps: [] };
  const setComponentName = (filePath, componentName) => {
    convertedFiles[filePath] = convertedFiles[filePath] || defaultOptions;
    convertedFiles[filePath].componentName = componentName;
  }
  const addThisMethod = (filePath, thisMethod) => {
    convertedFiles[filePath] = convertedFiles[filePath] || defaultOptions;
    convertedFiles[filePath].thisMethods.push(thisMethod);
  }
  const addThisProp = (filePath, thisProp) => {
    convertedFiles[filePath] = convertedFiles[filePath] || defaultOptions;
    convertedFiles[filePath].thisProps.push(thisProp);
  }

  withinFiles(Synvert.ALL_FILES, function () {
    withNode({ type: "ClassDeclaration", superClass: 'Component' }, () => {
      let todoAdded = false;
      let functionBodyIndent = this.currentNode.loc.end.column - 1;
      const functionBody = [];

      // const { name } = this.props;
      withNode({ type: "VariableDeclaration", declarations: { length: 1, first: { init: { type: "MemberExpression", object: "this", property: "props" } } } }, () => {
        this.currentNode.declarations[0].id.properties.forEach(property => addThisProp(this.currentFilePath, property.toSource()));
      });

      // this.props.name => name
      withNode({ type: "MemberExpression", object: { type: "MemberExpression", object: 'this', property: 'props' } }, () => {
        addThisProp(this.currentFilePath, this.currentNode.property.toSource());
      });

      // state = { key: value };
      withNode({ type: "PropertyDefinition", key: "state" }, () => {
        this.currentNode.value.properties.forEach(property => {
          const name = property.key.name
          const value = property.value.toSource()
          functionBody.push(indent(`const [${name}, set${name.replace(/^\w/, (c) => c.toUpperCase())}] = useState(${value});\n`, DEFAULT_INDENT))
        });
      });

      // foo = () => {}
      withNode({ type: "PropertyDefinition", value: { type: "ArrowFunctionExpression" } }, () => {
        const name = this.currentNode.key.name;
        const value = this.currentNode.value.fixIndentToSource();
        functionBody.push(indent(`const ${name} = ${value}\n`, DEFAULT_INDENT))
        addThisMethod(this.currentFilePath, name);
      });

      // componentDidMount() {
      // }
      withNode({ type: "MethodDefinition", key: { in: lifecycleMethods } }, () => {
        if (!todoAdded) {
          functionBody.push("  // Synvert TODO: transfer lifecycle methods to useState");
          todoAdded = true;
        }
        const lines = this.currentNode.fixIndentToSource().split("\n")
        functionBody.push(indent(lines.map(line => '// ' + line).join("\n"), DEFAULT_INDENT));
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

      setComponentName(this.currentFilePath, this.currentNode.id.name);
    });
  });

  withinFiles(`{${Object.keys(convertedFiles).join(',')},}`, function () {
    const { componentName, thisMethods, thisProps } = convertedFiles[this.currentFilePath];

    withNode({ type: "VariableDeclarator", id: componentName }, () => {
      withNode({ type: "ArrowFunctionExpression", params: { length: 1, first: "props" } }, () => {
        if (thisProps.length > 0) {
          replace("params.0", { with: `{ ${thisProps.join(", ")} }` });
        } else {
          deleteNode("params.0");
        }
      });
    });

    // <div onClick={this.clickHandler} />
    // =>
    // <div onClick={clickHandler} />
    withNode({ type: "MemberExpression", object: "this", property: { in: thisMethods } }, () => {
      deleteNode(['object', 'dot']);
    });

    // const { name } = this.props;
    withNode({ type: "VariableDeclaration", declarations: { length: 1, first: { init: { type: "MemberExpression", object: "this", property: "props" } } } }, () => {
      remove();
    });

    // this.props.name => name
    withNode({ type: "MemberExpression", object: { type: "MemberExpression", object: 'this', property: 'props' } }, () => {
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

    ifExistNode({ type: "CallExpression", callee:  "useState" }, () => {
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
