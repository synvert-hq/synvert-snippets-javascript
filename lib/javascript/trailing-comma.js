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

  configure({ parser: Synvert.Parser.ESPREE });

  withinFiles(Synvert.ALL_FILES, () => {
    findNode(`.ObjectExpression[loc.start.line!="{{loc.end.line}}"]`, function () {
      const lastProperty = this.currentNode.properties[this.currentNode.properties.length - 1];
      if (this.currentFileSource[lastProperty.end] !== ",") {
        insert(",", { to: "properties.last", at: "end" });
      }
    });
    findNode(`.ArrayExpression[loc.start.line!="{{loc.end.line}}"]`, function () {
      const lastElement = this.currentNode.elements[this.currentNode.elements.length - 1];
      if (this.currentFileSource[lastElement.end] !== ",") {
        insert(",", { to: "elements.last", at: "end" });
      }
    });
  });
});
