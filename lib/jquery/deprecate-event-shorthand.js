new Synvert.Rewriter("jquery", "deprecate-event-shorthand", () => {
  description(`
    jQuery.fn.click() event shorthand is deprecated.

    Cause: The .on() and .trigger() methods can set an event handler or generate an event for any event type, and should be used instead of the shortcut methods. This message also applies to the other event shorthands, including: blur, focus, focusin, focusout, resize, scroll, dblclick, mousedown, mouseup, mousemove, mouseover, mouseout, mouseenter, mouseleave, change, select, submit, keydown, keypress, keyup, and contextmenu.
  `);

  const eventShorthandNames = [
    "click",
    "blur",
    "focus",
    "focusin",
    "focusout",
    "resize",
    "scroll",
    "dblclick",
    "mousedown",
    "mouseup",
    "mousemove",
    "mouseover",
    "mouseout",
    "mouseenter",
    "mouseleave",
    "change",
    "select",
    "submit",
    "keydown",
    "keypress",
    "keyup",
    "contextmenu",
  ];

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    // $('#test').click(function(e) { });
    // =>
    // $('#test').on('click', function(e) { });
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression
          [expression=~/^(\\$|jQuery)/]
          [name IN (${eventShorthandNames.join(" ")})]]
        [arguments.length=1]`,
      () => {
        replaceWith('{{expression.expression}}.on("{{expression.name}}", {{arguments.0}})');
      },
    );

    // $form.submit();
    // =>
    // $form.trigger('submit');
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression
          [expression=~/^(\\$|jQuery)/]
          [name IN (${eventShorthandNames.join(" ")})]]
        [arguments.length=0]`,
      () => {
        replaceWith('{{expression.expression}}.trigger("{{expression.name}}")');
      },
    );
  });
});
