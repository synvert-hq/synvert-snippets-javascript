const Synvert = require("synvert-core");

new Synvert.Rewriter("jquery", "prop-boolean-properties", () => {
  description(`
    \`\`\`javascript
    $this.attr('checked', 'checked');
    \`\`\`

    =>

    \`\`\`javascript
    $this.prop('checked', true);
    \`\`\`

    \`\`\`javascript
    $this.attr('disabled', true);
    \`\`\`

    =>

    \`\`\`javascript
    $this.prop('disabled', true);
    \`\`\`

    \`\`\`javascript
    $this.attr('readonly', false);
    \`\`\`

    =>

    \`\`\`javascript
    $this.prop('readonly', false);
    \`\`\`

    \`\`\`javascript
    $this.removeAttr('selected');
    \`\`\`

    =>
    \`\`\`javascript
    $this.prop('selected', false);
    \`\`\`
  `);

  configure({ parser: Synvert.Parser.ESPREE });

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
