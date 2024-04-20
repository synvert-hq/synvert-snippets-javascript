new Synvert.Rewriter("jquery", "ajax-events-attached-to-document", () => {
  description(`
    As of jQuery 1.9, the global Ajax events (ajaxStart, ajaxStop, ajaxSend, ajaxComplete, ajaxError, and ajaxSuccess) are only triggered on the document element.
    Change the program to listen for the Ajax events on the document. For example, if the code currently looks like this:

    $("#status").ajaxStart(function(){ $(this).text("Ajax started"); });

    Change it to this:

    $(document).ajaxStart(function(){ $("#status").text("Ajax started"); });
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  ifNpm("jquery", ">= 1.9");

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression
          [expression=.CallExpression
            [expression IN ($ jQuery)]
            [arguments.length=1]
            [arguments.0=.StringLiteral]]
          [name IN (ajaxStart ajaxStop ajaxSend ajaxComplete ajaxError ajaxSuccess)]]
        [arguments.length=1][arguments.0=.FunctionExpression]`,
      () => {
        const selector = this.currentNode.expression.expression.arguments[0].getText();
        group(() => {
          findNode(`.CallExpression[expression IN ($ jQuery)][arguments.length=1][arguments.0=.ThisKeyword]`, () => {
            replace("arguments.0", { with: selector });
          });
          replace("expression.expression.arguments.0", { with: "document" });
        });
      },
    );
  });
});
