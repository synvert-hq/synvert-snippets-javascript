const Synvert = require("synvert-core");

new Synvert.Rewriter("jquery", "deprecate-ajax-success-error-and-complete", () => {
  description(`
    \`\`\`javascript
    $.ajax({
      url: 'URL',
      type: 'POST',
      data: yourData,
      datatype: 'json',
      success: function (data) {
        successFunction(data);
      },
      error: function (jqXHR, textStatus, errorThrown) { errorFunction(); }
    });
    \`\`\`

    =>

    \`\`\`javascript
    $.ajax({
      url: 'URL',
      type: 'POST',
      data: yourData,
      datatype: 'json',
    })
    .done(function (data) {
      successFunction(data);
    })
    .fail(function (jqXHR, textStatus, errorThrown) { errorFunction(); });
    \`\`\`
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT, strategy: Synvert.Strategy.ALLOW_INSERT_AT_SAME_POSITION });

  withinFiles(Synvert.ALL_FILES, function () {
    const functionMap = { success: "done", error: "fail", complete: "always" };

    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression[expression IN ($ jQuery)][name=ajax]]
        [arguments.length=1][arguments.0=.ObjectLiteralExpression]`,
      () => {
        const column = this.mutationAdapter.getEndLoc(this.currentNode).column - 2;
        for (const oldFunctionName of Object.keys(functionMap)) {
          let functionNode;
          findNode(`.PropertyAssignment[name=${oldFunctionName}]`, () => {
            functionNode = this.currentNode;
            remove();
          });
          if (functionNode) {
            insert(
              "\n" +
                indent(
                  `.${functionMap[oldFunctionName]}(${this.mutationAdapter.getSource(functionNode.initializer, {
                    fixIndent: true,
                  })})`,
                  column
                ),
              { at: "end" }
            );
          }
        }
      }
    );
  });
});
