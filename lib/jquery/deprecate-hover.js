new Synvert.Rewriter("jquery", "deprecate-hover", () => {
  description(`
    JQMIGRATE: jQuery.fn.hover() is deprecated
    Cause: The .hover() method is a shorthand for the use of the mouseover/mouseout events. It is often a poor user interface choice because it does not allow for any small amounts of delay between when the mouse enters or exits an area and when the event fires. This can make it quite difficult to use with UI widgets such as drop-down menus. For more information on the problems of hovering, see the hoverIntent plugin.

    Solution: Review uses of .hover() to determine if they are appropriate, and consider use of plugins such as hoverIntent as an alternative. The direct replacement for .hover(fn1, fn2), is .on("mouseenter", fn1).on("mouseleave", fn2).
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression[expression IN (/^\\$/ /^jQuery/)][name=hover]]
        [arguments.length=2]`,
      () => {
        replaceWith(
          `{{expression.expression}}.on(${wrapWithQuotes("mouseenter")}, {{arguments.0}}).on(${wrapWithQuotes(
            "mouseover"
          )}, {{arguments.1}})`
        );
      }
    );
  });
});
