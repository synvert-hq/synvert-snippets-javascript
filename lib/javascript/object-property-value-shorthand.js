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

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(".Property[key=.Identifier][value=.Identifier][key.name={{value.name}}][key.start!={{value.start}}]", () => {
      deleteNode(["semicolon", "value"]);
    });
  });
});
