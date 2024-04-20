new Synvert.Rewriter("jquery", "deprecate-global-ajax-register-calls", () => {
  description(`
    \`\`\`javascript
    $(document).ajaxComplete(handler)
    $(document).ajaxError(handler)
    $(document).ajaxSend(handler)
    $(document).ajaxStart(handler)
    $(document).ajaxStop(handler)
    $(document).ajaxSuccess(handler)
    \`\`\`

    =>

    \`\`\`javascript
    $(document).on("ajaxComplete", handler)
    $(document).on("ajaxError", handler)
    $(document).on("ajaxSend", handler)
    $(document).on("ajaxStart", handler)
    $(document).on("ajaxStop", handler)
    $(document).on("ajaxSuccess", handler)
    \`\`\`
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  ifNpm("jquery", ">= 3.5");

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression
          [expression=~/^(\\$|jQuery)/]
          [name IN (ajaxComplete ajaxError ajaxSend ajaxStart ajaxStop ajaxSuccess)]]
        [arguments.length=1]`,
      () => {
        group(() => {
          replace("expression.name", { with: "on" });
          insert('"{{expression.name}}"', { to: "arguments.0", at: "beginning", andComma: true });
        });
      },
    );
  });
});
