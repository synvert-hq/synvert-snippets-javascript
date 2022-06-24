const Synvert = require("synvert-core");

new Synvert.Rewriter("jquery", "deprecate-event-shorthand", () => {
  configure({ sourceType: "script" });

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

  withinFiles(Synvert.ALL_JS_FILES, function () {
    // $('#test').click(function(e) { });
    // =>
    // $('#test').on('click', function(e) { });
    findNode(
      `.CallExpression[callee=.MemberExpression[object IN (/^\\$/ /^jQuery/)][property IN (${eventShorthandNames.join(
        " "
      )})]]
                [arguments.length=1][arguments.0.type IN (FunctionExpression ArrowFunctionExpression)]`,
      () => {
        replace("callee.property", { with: "on" });
        insert("'{{callee.property}}', ", { to: "arguments.0", at: "beginning" });
      }
    );

    // $form.submit();
    // =>
    // $form.trigger('submit');
    findNode(
      `.CallExpression[callee=.MemberExpression[object IN (/^\\$/ /^jQuery/)][property IN (${eventShorthandNames.join(
        " "
      )})]]
                [arguments.length=0]`,
      () => {
        replace(["callee.property", "arguments"], { with: "trigger('{{callee.property}}')" });
      }
    );
  });
});
