const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "object-property-value-shorthand", () => {
  description(`
    const someObject = {
      cat: cat,
      dog: dog,
      bird: bird
    }

    =>

    const someObject = {
      cat,
      dog,
      bird
    }
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(`.PropertyAssignment[name=.Identifier][initializer=.Identifier][key="{{value}}"]`, () => {
      deleteNode(["semicolon", "initializer"]);
    });
  });
});
