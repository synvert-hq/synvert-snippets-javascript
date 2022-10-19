const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "unquote-properties", () => {
  description(`
    var x = { 'quotedProp': 1 };
    =>
    var x = { quotedProp: 1 };
  `);

  configure({ parser: "typescript" });

  withinFiles(Synvert.ALL_FILES, () => {
    findNode(".PropertyAssignment[name=.StringLiteral[text!~/(\\s|-)/]]", () => {
      replace("name", { with: "{{name.text}}" });
    });
  });
});
