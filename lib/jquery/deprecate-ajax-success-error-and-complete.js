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

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(
      `.CallExpression[callee=.MemberExpression[object IN ($ jQuery)][property=ajax]]
                [arguments.length=1][arguments.0=.ObjectExpression]`,
      () => {
        const column = this.currentNode.arguments[0].loc.end.column - 1;
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
                indent(`.${functionMap[oldFunctionName]}(${functionNode.value.toSource({ fixIndent: true })})`, column),
              { at: "end" }
            );
          }
        });
      }
    );
  });
});
