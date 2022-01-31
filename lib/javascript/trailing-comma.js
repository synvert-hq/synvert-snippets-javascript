const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "trailing-comma", () => {
  description(`
    const object = {
      hello: 'hello',
      allo: 'allo',
      hola: 'hola'
    };

    const array = [
      'hello',
      'allo',
      'hola'
    ];
    =>
    const object = {
      hello: 'hello',
      allo: 'allo',
      hola: 'hola',
    };

    const array = [
      'hello',
      'allo',
      'hola',
    ];
  `);

  withinFiles(Synvert.ALL_FILES, () => {
    withNode({ type: "ObjectExpression" }, function () {
      if (this.currentNode.loc.start.line !== this.currentNode.loc.end.line) {
        const lastProperty = this.currentNode.properties[this.currentNode.properties.length - 1];
        if (this.currentFileSource[lastProperty.end] !== ",") {
          insert(",", { to: "properties.last", at: "end" });
        }
      }
    });
    withNode({ type: "ArrayExpression" }, function () {
      if (this.currentNode.loc.start.line !== this.currentNode.loc.end.line) {
        const lastElement = this.currentNode.elements[this.currentNode.elements.length - 1];
        if (this.currentFileSource[lastElement.end] !== ",") {
          insert(",", { to: "elements.last", at: "end" });
        }
      }
    });
  });
});
