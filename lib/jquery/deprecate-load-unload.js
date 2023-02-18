new Synvert.Rewriter("jquery", "deprecate-load-unload", () => {
  description(`
    JQMIGRATE: jQuery.fn.load() is deprecated
    JQMIGRATE: jQuery.fn.unload() is deprecated
    Cause: The .load() and .unload() event methods attach a "load" and "unload" event, respectively, to an element. They were deprecated in 1.9 and removed in 3.0 to reduce confusion with the AJAX-related .load() method that loads HTML fragments and which has not been deprecated. Note that these two methods are used almost exclusively with a jQuery collection consisting of only the window element. Also note that attaching an "unload" or "beforeunload" event on a window via any means can impact performance on some browsers because it disables the document cache (bfcache). For that reason we strongly advise against it.

    Solution: Change any use of $().load(fn) to $().on("load", fn) and $().unload(fn) to $().on("unload", fn).
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression
          [expression IN (/^\\$/ /^jQuery/)]
          [name IN (load unload)]]
        [arguments.length=1]`,
      () => {
        const eventName = this.mutationAdapter.getSource(this.currentNode.expression.name);
        replaceWith(`{{expression.expression}}.on(${wrapWithQuotes(eventName)}, {{arguments.0}})`);
      }
    );
  });
});
