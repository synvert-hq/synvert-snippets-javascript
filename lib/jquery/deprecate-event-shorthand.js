const Synvert = require("synvert-core");
const { InsertAction } = require("synvert-core/lib/action");

new Synvert.Rewriter("jquery", "deprecate-event-shorthand", () => {
  description(`
    jQuery.fn.click() event shorthand is deprecated.

    Cuase: The .on() and .trigger() methods can set an event handler or generate an event for any event type, and should be used instead of the shortcut methods. This message also applies to the other event shorthands, including: blur, focus, focusin, focusout, resize, scroll, dblclick, mousedown, mouseup, mousemove, mouseover, mouseout, mouseenter, mouseleave, change, select, submit, keydown, keypress, keyup, and contextmenu.
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

  withinFiles(Synvert.ALL_FILES, function () {
    withNode(
      {
        type: "CallExpression",
        callee: { type: "MemberExpression", object: /^\$/, property: { in: eventShorthandNames } },
        arguments: { length: 1, first: { type: { in: ["FunctionExpression", "ArrowFunctionExpression"] } } },
      },
      () => {
        replace("callee.property", { with: "on" });
        insert("'{{callee.property}}', ", { to: "arguments.0", at: "beginning" });
      }
    );

    withNode(
      {
        type: "CallExpression",
        callee: { type: "MemberExpression", object: /^\$/, property: { in: eventShorthandNames } },
        arguments: { length: 0 },
      },
      () => {
        replace("callee.property", { with: "trigger" });
        replace("arguments", { with: "('{{callee.property}}')" });
      }
    );
  });
});
