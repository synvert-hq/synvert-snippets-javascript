const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "unquote-properties", () => {
  description(`
    var x = { 'quotedProp': 1 };
    =>
    var x = { quotedProp: 1 };
  `);

  withinFiles(Synvert.ALL_JS_FILES, () => {
    findNode(".Property[key=.Literal[value!~/(\\s|-)/]]", () => {
      replace("key", { with: "{{key.value}}" });
    });
  });
});
