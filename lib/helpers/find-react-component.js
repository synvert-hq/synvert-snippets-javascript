new Synvert.Helper("find-react-component", function (options, helperFn) {
  let componentName = null;
  withNode(".ExportAssignment[expression=.Identifier]", function () {
    componentName = this.currentNode.expression.escapedText;
  });
  withNode(`.VariableDeclaration[name=${componentName}][initializer=.ArrowFunction]`, function () {
    helperFn();
  });
});
