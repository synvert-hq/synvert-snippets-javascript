const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "unquoteProperties", () => {
  description(`
    var x = { 'quotedProp': 1 };
    =>
    var x = { quotedProp: 1 };
  `);

  withFiles("**/*.js", () => {
    withNode({ type: "Property", key: { type: "Literal", value: { not: /(\s|-)/ } } }, () => {
      replace("key", { with: "{{key.value}}" });
    });
  });
});
