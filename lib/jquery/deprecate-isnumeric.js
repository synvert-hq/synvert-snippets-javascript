new Synvert.Rewriter("jquery", "deprecate-isnumeric", () => {
  description(`
    JQMIGRATE: jQuery.isNumeric() is deprecated
    Cause: This method was used by jQuery to determine if certain string arguments could be converted to numbers, but the name led people to apply their own interpretations to what the method means. As a result, it often doesn't meet the needs of specific cases. For example, a 25-character string of only digits is technically a valid number, but JavaScript cannot represent it accurately. The string "0x251D" is a valid hexadecimal number but may not be acceptable numeric input to a web form.

    Solution: Use a test for being numeric that makes sense for the specific situation. For example, instead of jQuery.isNumeric(string), use isNan(parseFloat(string)) if a floating point number is expected, or string.test(/^[0-9]{1,8}$/) if a sequence of 1 to 8 digits is expected.
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  ifNpm("jquery", ">= 3.3");

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(
      `.CallExpression[expression=.PropertyAccessExpression[expression in ($ jQuery)][name=isNumeric]][arguments.length=1]`,
      () => {
        replaceWith("isNaN(parseFloat({{arguments.0}}))");
      },
    );
  });
});
