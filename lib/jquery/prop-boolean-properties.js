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
    $this.attr('selected', false);
    \`\`\`

    =>

    \`\`\`javascript
    $this.prop('selected', false);
    \`\`\`
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression
          [expression=~/^(\\$|jQuery)/]
          [name=attr]]
        [arguments.length=2]
        [arguments.0=.StringLiteral[text IN ("checked" "disabled" "readonly" "selected")]]`,
      () => {
        group(() => {
          replace("expression.name", { with: "prop" });
          replace("arguments.1", {
            with: String(this.mutationAdapter.getSource(this.currentNode.arguments[1]) !== "false"),
          });
        });
      },
    );
  });
});
