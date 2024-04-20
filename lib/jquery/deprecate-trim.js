new Synvert.Rewriter("jquery", "deprecate-trim", () => {
  description(`
    JQMIGRATE: jQuery.trim is deprecated; use String.prototype.trim
    Cause: Older versions of IE & Android Browser didn't implement a method to trim strings so jQuery provided a cross-browser implementation. The browsers supported by jQuery 3.0 all provide a standard method for this purpose.

    Solution: Replace any calls to jQuery.trim( text ) with text.trim() if you know text is a string; otherwise, you can replace it with String.prototype.trim.call( text == null ? "" : text ).
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  ifNpm("jquery", ">= 3.5");

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression
          [expression=~/^(\\$|jQuery)/]
          [name=trim]]
        [arguments.length=1]`,
      () => {
        replaceWith("{{arguments.0}}.trim()");
      },
    );
  });
});
