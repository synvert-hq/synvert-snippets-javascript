const Synvert = require("synvert-core");
const { ALL_FILES } = require("../constants");

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

  withinFiles(ALL_FILES, function () {
    withNode({ type: "Property" }, () => {
      if (this.currentNode.key.name === this.currentNode.value.name && this.currentNode.key.start !== this.currentNode.value.start) {
        deleteNode(['semicolon', 'value']);
      }
    });
  });
});
