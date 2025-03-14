new Synvert.Rewriter("react", "transform-class-components-to-functions", () => {
  description("transform react class components to functions");

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

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    const currentFilePath = this.filePath;
    findNode(".ClassDeclaration[heritageClauses.0.types.0=Component]", () => {
      let tabSize = this.mutationAdapter.getIndent(this.currentNode) / Synvert.Configuration.tabWidth;
      const functionBody = [];
      const lifecycleMethods = [];

      // const { name } = this.props;
      findNode(
        ".VariableDeclarationList[declarations.length=1][declarations.0.initializer=.PropertyAccessExpression[expression=this][name=props]]",
        () => {
          for (const element of this.currentNode.declarations[0].name.elements) {
            addThisProp(currentFilePath, this.mutationAdapter.getSource(element));
          }
        },
      );

      // this.props.name => name
      findNode(".PropertyAccessExpression[expression=.PropertyAccessExpression[expression=this][name=props]]", () => {
        addThisProp(currentFilePath, this.mutationAdapter.getSource(this.currentNode.name));
      });

      // state = { key: value };
      findNode(".PropertyDeclaration[name=state]", () => {
        for (const property of this.currentNode.initializer.properties) {
          const name = property.name.escapedText;
          const value = this.mutationAdapter.getSource(property.initializer);
          functionBody.push(
            indentCode(`const [${name}, set${name.replace(/^\w/, (c) => c.toUpperCase())}] = useState(${value});\n`, 1),
          );
        }
      });

      // foo = () => {}
      findNode(".PropertyDeclaration[initializer=.ArrowFunction]", () => {
        const name = this.currentNode.name.escapedText;
        const value = this.mutationAdapter.getSource(this.currentNode.initializer, { fixIndent: true });
        functionBody.push(indentCode(`const ${name} = ${value}\n`, 1));
        addThisMethod(currentFilePath, name);
      });

      // componentDidMount() {
      // }
      findNode(`.MethodDeclaration[name IN (${LIFECYCLE_METHODS.join(" ")})]`, () => {
        lifecycleMethods.push(this.currentNode);
      });

      if (lifecycleMethods.length > 0) {
        functionBody.push(addLeadingSpaces("// Synvert TODO: convert lifecycle methods to useEffect by yourself"));
        setUseEffect(currentFilePath);
        for (const lifecycleMethod of lifecycleMethods) {
          const lines = this.mutationAdapter.getSource(lifecycleMethod, { fixIndent: true }).split("\n");
          functionBody.push(indentCode(lines.map((line) => (line.length > 0 ? "// " + line : "//")).join("\n"), 1));
        }
      }

      // render() {}
      //
      // convert it temporarily to `const render = () => {}`
      // to avoid duplicated declarations.
      // it will be removed in the next round.
      findNode(".MethodDeclaration[name=render]", () => {
        functionBody.push(
          indentCode(this.mutationAdapter.getSource(this.currentNode, { fixIndent: true }), 1).replace(
            /render ?\(\)/,
            "const render = () =>",
          ),
        );
      });

      replaceWith(
        indentCode(
          `
const {{name}} = (props) => {
${functionBody.join("\n")}
}
      `.trim(),
          tabSize,
          { skipFirstLine: true },
        ),
      );

      setComponentName(currentFilePath, this.currentNode.name.escapedText);
    });
  });

  withinFiles(`{${Object.keys(convertedFiles).join(",")},}`, function () {
    const { componentName, useEffect, thisMethods, thisProps } = convertedFiles[this.filePath];
    const conflictNames = thisMethods.filter((method) => thisProps.includes(method));

    findNode(
      `.VariableDeclaration[name=${componentName}] .ArrowFunction[parameters.length=1][parameters.0=props]`,
      () => {
        if (thisProps.length === 0) {
          // prettier-ignore
          delete("parameters.0");
        } else if (conflictNames.length === 0) {
          replace("parameters.0", { with: `{ ${[...new Set(thisProps)].join(", ")} }` });
        } else if (thisProps.length - conflictNames.length > 0) {
          replace("parameters.0", {
            with: `{ ${[...new Set(thisProps.filter((prop) => !thisMethods.includes(prop)))].join(", ")}, ...props }`,
          });
        }
      },
    );

    // <div onClick={this.clickHandler} />
    // =>
    // <div onClick={clickHandler} />
    findNode(`.PropertyAccessExpression[expression=this][name IN (${thisMethods.join(" ")})]`, () => {
      // prettier-ignore
      delete(["expression", "dot"]);
    });

    // const { name } = this.props;
    findNode(
      `.VariableDeclarationList[declarations.length=1][declarations.0.initializer=.PropertyAccessExpression[expression=this][name=props]]`,
      () => {
        remove();
      },
    );

    // const { name } = this.state;
    findNode(
      `.VariableDeclarationList[declarations.length=1][declarations.0.initializer=.PropertyAccessExpression[expression=this][name=state]]`,
      () => {
        remove();
      },
    );

    // this.props.name => name
    findNode(
      `.PropertyAccessExpression[expression=.PropertyAccessExpression[expression=this][name=props]][name NOT IN (${conflictNames.join(
        " ",
      )})]`,
      () => {
        // prettier-ignore
        delete(["expression", "dot"]);
      },
    );

    // this.props.name => props.name
    findNode(
      `.PropertyAccessExpression[expression=.PropertyAccessExpression[expression=this][name=props]][name IN (${conflictNames.join(
        " ",
      )})]`,
      () => {
        // prettier-ignore
        delete(["expression.expression", "expression.dot"]);
      },
    );

    // this.state.name => name
    findNode(".PropertyAccessExpression[expression=.PropertyAccessExpression[expression=this][name=state]]", () => {
      // prettier-ignore
      delete(["expression", "dot"]);
    });

    // this.setState({ foo: 'bar' }) => setFoo('bar')
    findNode(".CallExpression[expression=.PropertyAccessExpression[expression=this][name=setState]]", () => {
      const properties = [];
      findNode(".ObjectLiteralExpression .PropertyAssignment", () => {
        properties.push({
          name: this.currentNode.name.escapedText,
          value: this.mutationAdapter.getSource(this.currentNode.initializer),
        });
      });
      const useStateStatements = properties.map(
        ({ name, value }) => `set${name.replace(/^\w/, (c) => c.toUpperCase())}(${value})`,
      );
      replaceWith(useStateStatements.join("\n"));
    });

    // const render = () => {}
    findNode(
      ".VariableDeclarationList[declarations.length=1][declarations.0.name=render][declarations.0.initializer=.ArrowFunction]",
      () => {
        const tabWidth = this.mutationAdapter.getIndent(this.currentNode) / Synvert.Configuration.tabWidth;
        const body = [];
        for (const statement of this.currentNode.declarations[0].initializer.body.statements) {
          body.push(this.mutationAdapter.getSource(statement, { fixIndent: true }));
        }
        replaceWith(indentCode(body.join("\n"), tabWidth, { skipFirstLine: true }));
      },
    );

    ifExistNode(`.CallExpression[expression=useState]`, () => {
      callHelper("helpers/add-import", { namedImport: "useState", moduleSpecifier: "react" });
    });

    if (useEffect) {
      callHelper("helpers/add-import", { namedImport: "useEffect", moduleSpecifier: "react" });
    }

    callHelper("helpers/remove-imports", { importNames: ["Component"] });
  });
});
