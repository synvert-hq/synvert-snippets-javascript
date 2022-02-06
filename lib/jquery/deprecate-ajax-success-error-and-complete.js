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
    withNode(
      {
        type: "CallExpression",
        callee: { type: "MemberExpression", object: { in: ["$", "jQuery"] }, property: "ajax" },
        arguments: { length: 1, first: { type: "ObjectExpression" } },
      },
      () => {
        const column = this.currentNode.arguments[0].loc.end.column - 1;
        const functionMap = { success: "done", error: "fail", complete: "always" };
        Object.keys(functionMap).forEach((oldFunctionName) => {
          let functionNode;
          withNode({ type: "Property", key: oldFunctionName }, () => {
            functionNode = this.currentNode;
            remove();
          });
          if (functionNode) {
            insert(
              "\n" + indent(`.${functionMap[oldFunctionName]}(${functionNode.value.fixIndentToSource()})`, column),
              { at: "end" }
            );
          }
        });
      }
    );
  });
});
