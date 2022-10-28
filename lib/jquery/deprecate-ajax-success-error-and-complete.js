const Synvert = require("synvert-core");

new Synvert.Rewriter("jquery", "deprecate-ajax-success-error-and-complete", () => {
  description(`
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

    =>

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
  `);

  configure({ parser: Synvert.Parser.ESPREE, strategy: Synvert.Strategy.ALLOW_INSERT_AT_SAME_POSITION });

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(
      `.CallExpression
        [callee=.MemberExpression[object IN ($ jQuery)][property=ajax]]
        [arguments.length=1][arguments.0=.ObjectExpression]`,
      () => {
        const column = mutationAdapter().getEndLoc(this.currentNode).column - 2;
        const functionMap = { success: "done", error: "fail", complete: "always" };
        Object.keys(functionMap).forEach((oldFunctionName) => {
          let functionNode;
          findNode(`.Property[key=${oldFunctionName}]`, () => {
            functionNode = this.currentNode;
            remove();
          });
          if (functionNode) {
            insert(
              "\n" +
                indent(`.${functionMap[oldFunctionName]}(${mutationAdapter().getSource(functionNode.value, { fixIndent: true })})`, column),
              { at: "end" }
            );
          }
        });
      }
    );
  });
});
