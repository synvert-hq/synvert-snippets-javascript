const Synvert = require("synvert-core");
const { ALL_FILES } = require("../constants");

new Synvert.Rewriter("javascript", "unquote-properties", () => {
  description(`
    var x = { 'quotedProp': 1 };
    =>
    var x = { quotedProp: 1 };
  `);

  withinFiles(ALL_FILES, () => {
    withNode({ type: "Property", key: { type: "Literal", value: { not: /(\s|-)/ } } }, () => {
      replace("key", { with: "{{key.value}}" });
    });
  });
});
