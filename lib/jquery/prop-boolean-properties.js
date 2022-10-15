const Synvert = require("synvert-core");

new Synvert.Rewriter("jquery", "prop-boolean-properties", () => {
  description(`
    $this.attr('checked', 'checked');
    =>
    $this.prop('checked', true);

    $this.attr('disabled', true);
    =>
    $this.prop('disabled', true);

    $this.attr('readonly', false);
    =>
    $this.prop('readonly', false);

    $this.removeAttr('selected');
    =>
    $this.prop('selected', false);
  `);

  configure({ parser: "espree" });

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(
      `.CallExpression[callee=.MemberExpression[object IN (/^\\$/ /^jQuery/)][property=attr]]
                [arguments.length=2][arguments.0.value IN (checked disabled readonly selected)]`,
      () => {
        replace("callee.property", { with: "prop" });
        replace("arguments.1", { with: String(this.currentNode.arguments[1].value !== false) });
      }
    );
  });
});
