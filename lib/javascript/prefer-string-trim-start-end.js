const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "prefer-string-trim-start-end", () => {
  description(`
    const foo1 = bar.trimLeft();
    const foo2 = bar.trimRight();
    =>
    const foo1 = bar.trimStart();
    const foo2 = bar.trimEnd();
  `);

  withinFiles(Synvert.ALL_JS_FILES, () => {
    findNode(".CallExpression[callee=.MemberExpression[property=trimLeft]][arguments.length=0]", () => {
      replace("callee.property", { with: "trimStart" });
    });
    findNode(".CallExpression[callee=.MemberExpression[property=trimRight]][arguments.length=0]", () => {
      replace("callee.property", { with: "trimEnd" });
    });
  });
});
