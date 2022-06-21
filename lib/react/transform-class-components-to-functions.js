const Synvert = require("synvert-core");

new Synvert.Rewriter("react", "transform-class-components-to-functions", () => {
  description("transform react class components to functions");

  const DEFAULT_INDENT = 2;
  const LIFECYCLE_METHODS = [
    "componentDidMount",
    "componentDidUpdate",
    "componentWillReceiveProps",
    "componentWillUnmount",
    "componentWillUpdate",
    "componentDidCatch",
    "shouldComponentUpdate",
  ];

  const convertedFiles = {};
  const setComponentName = (filePath, componentName) => {
    convertedFiles[filePath] = convertedFiles[filePath] || { useEffect: false, thisMethods: [], thisProps: [] };
    convertedFiles[filePath].componentName = componentName;
  };
  const setUseEffect = (filePath) => {
    convertedFiles[filePath] = convertedFiles[filePath] || { useEffect: false, thisMethods: [], thisProps: [] };
    convertedFiles[filePath].useEffect = true;
  };
  const addThisMethod = (filePath, thisMethod) => {
    convertedFiles[filePath] = convertedFiles[filePath] || { useEffect: false, thisMethods: [], thisProps: [] };
    convertedFiles[filePath].thisMethods.push(thisMethod);
  };
  const addThisProp = (filePath, thisProp) => {
    convertedFiles[filePath] = convertedFiles[filePath] || { useEffect: false, thisMethods: [], thisProps: [] };
    convertedFiles[filePath].thisProps.push(thisProp);
  };

  withinFiles(Synvert.ALL_FILES, function () {
    const currentFilePath = this.currentFilePath;
    findNode(".ClassDeclaration[superClass=Component]", () => {
      let functionBodyIndent = this.currentNode.loc.end.column - 1;
      const functionBody = [];
      const lifecycleMethods = [];

      // const { name } = this.props;
      findNode(
        ".VariableDeclaration[declarations.length=1][declarations.first.init=.MemberExpression[object=this][property=props]]",
        () => {
          this.currentNode.declarations[0].id.properties.forEach((property) =>
            addThisProp(currentFilePath, property.toSource())
          );
        }
      );

      // this.props.name => name
      findNode(".MemberExpression[object=.MemberExpression[object=this][property=props]]", () => {
        addThisProp(currentFilePath, this.currentNode.property.toSource());
      });

      // state = { key: value };
      findNode(".PropertyDefinition[key=state]", () => {
        this.currentNode.value.properties.forEach((property) => {
          const name = property.key.name;
          const value = property.value.toSource();
          functionBody.push(
            indent(
              `const [${name}, set${name.replace(/^\w/, (c) => c.toUpperCase())}] = useState(${value});\n`,
              DEFAULT_INDENT
            )
          );
        });
      });

      // foo = () => {}
      findNode(".PropertyDefinition[value=.ArrowFunctionExpression]", () => {
        const name = this.currentNode.key.name;
        const value = this.currentNode.value.toSource({ fixIndent: true });
        functionBody.push(indent(`const ${name} = ${value}\n`, DEFAULT_INDENT));
        addThisMethod(currentFilePath, name);
      });

      // componentDidMount() {
      // }
      findNode(`.MethodDefinition[key IN (${LIFECYCLE_METHODS.join(" ")})]`, () => {
        lifecycleMethods.push(this.currentNode);
      });

      if (lifecycleMethods.length > 0) {
        functionBody.push("  // Synvert TODO: convert lifecycle methods to useEffect by yourself");
        setUseEffect(currentFilePath);
        lifecycleMethods.forEach((lifecycleMethod) => {
          const lines = lifecycleMethod.toSource({ fixIndent: true }).split("\n");
          functionBody.push(
            indent(lines.map((line) => (line.length > 0 ? "// " + line : "//")).join("\n"), DEFAULT_INDENT)
          );
        });
      }

      // render() {}
      //
      // convert it temporarily to `const render = () => {}`
      // to avoid duplicated declarations.
      // it will be removed in the next round.
      findNode(".MethodDefinition[key=render]", () => {
        functionBody.push(
          indent(this.currentNode.toSource({ fixIndent: true }), DEFAULT_INDENT).replace(
            /render ?\(\)/,
            "const render = () =>"
          )
        );
      });

      replaceWith(
        indent(
          `
const {{id}} = (props) => {
${functionBody.join("\n")}
}
      `.trim(),
          functionBodyIndent
        ),
        { autoIndent: false }
      );

      setComponentName(currentFilePath, this.currentNode.id.name);
    });
  });

  withinFiles(`{${Object.keys(convertedFiles).join(",")},}`, function () {
    const { componentName, useEffect, thisMethods, thisProps } = convertedFiles[this.currentFilePath];
    const conflictNames = thisMethods.filter((method) => thisProps.includes(method));

    findNode(
      `.VariableDeclarator[id=${componentName}] .ArrowFunctionExpression[params.length=1][params.first=props]`,
      () => {
        if (thisProps.length === 0) {
          deleteNode("params.0");
        } else if (conflictNames.length === 0) {
          replace("params.0", { with: `{ ${[...new Set(thisProps)].join(", ")} }` });
        } else if (thisProps.length - conflictNames.length > 0) {
          replace("params.0", {
            with: `{ ${[...new Set(thisProps.filter((prop) => !thisMethods.includes(prop)))].join(", ")}, ...props }`,
          });
        }
      }
    );

    // <div onClick={this.clickHandler} />
    // =>
    // <div onClick={clickHandler} />
    findNode(`.MemberExpression[object=this][property IN (${thisMethods.join(" ")})]`, () => {
      deleteNode(["object", "dot"]);
    });

    // const { name } = this.props;
    findNode(
      `.VariableDeclaration[declarations.length=1][declarations.first.init=.MemberExpression[object=this][property=props]]`,
      () => {
        remove();
      }
    );

    // const { name } = this.state;
    findNode(
      `.VariableDeclaration[declarations.length=1][declarations.first.init=.MemberExpression[object=this][property=state]]`,
      () => {
        remove();
      }
    );

    // this.props.name => name
    findNode(
      `.MemberExpression[object=.MemberExpression[object=this][property=props]][property NOT IN (${conflictNames.join(
        " "
      )})]`,
      () => {
        deleteNode(["object", "dot"]);
      }
    );

    // this.props.name => props.name
    findNode(
      `.MemberExpression[object=.MemberExpression[object=this][property=props]][property IN (${conflictNames.join(
        " "
      )})]`,
      () => {
        deleteNode(["object.object", "object.dot"]);
      }
    );

    // this.state.name => name
    findNode(".MemberExpression[object=.MemberExpression[object=this][property=state]]", () => {
      deleteNode(["object", "dot"]);
    });

    // this.setState(foo: 'bar') => setFoo('bar')
    findNode(".CallExpression[callee=.MemberExpression[object=this][property=setState]]", () => {
      const properties = [];
      findNode(".ObjectExpression .Property", () => {
        properties.push({ name: this.currentNode.key.name, value: this.currentNode.value.toSource() });
      });
      const useStateStatements = properties.map(
        ({ name, value }) => `set${name.replace(/^\w/, (c) => c.toUpperCase())}(${value})`
      );
      replaceWith(useStateStatements.join("\n"));
    });

    // const render = () => {}
    findNode(
      ".VariableDeclaration[declarations.length=1][declarations.first=.VariableDeclarator[id=render][init=.ArrowFunctionExpression]]",
      () => {
        const body = this.currentNode.declarations[0].init.body.body;
        replaceWith(body.toSource({ fixIndent: true }));
      }
    );

    // import React, { Component } from 'react'
    // =>
    // import React, { Component, useState } from 'react'
    findNode(
      `:has(.CallExpression[callee=useState])
                .ImportDeclaration[source.value=react][specifiers.first=.ImportDefaultSpecifier[local=React]]
                :not_has(.ImportSpecifier[local=useState])
                .ImportSpecifier[local=Component]`,
      () => {
        insert(", useState", { at: "end" });
      }
    );

    if (useEffect) {
      // import React, { Component } from 'react'
      // =>
      // import React, { Component, useEffect } from 'react'
      findNode(
        `.ImportDeclaration[source.value=react][specifiers.first=.ImportDefaultSpecifier[local=React]]
                  :not_has(.ImportSpecifier[local=useEffect])
                  .ImportSpecifier[local=Component]`,
        () => {
          insert(", useEffect", { at: "end" });
        }
      );
    }

    // import React, { Component } from 'react'
    // =>
    // import React from 'react'
    findNode(".ImportSpecifier[local=Component]", () => {
      remove();
    });
  });
});
