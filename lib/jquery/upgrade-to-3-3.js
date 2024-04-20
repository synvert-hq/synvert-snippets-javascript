new Synvert.Rewriter("jquery", "upgrade-to-3-3", () => {
  description(`
    Upgrade jquery to 3.3.
  `);

  addSnippet("jquery", "deprecate-delegate-undelegate");
  addSnippet("jquery", "deprecate-event-shorthand");
  addSnippet("jquery", "deprecate-hover");
  addSnippet("jquery", "deprecate-isarray");
  addSnippet("jquery", "deprecate-isfunction");
  addSnippet("jquery", "deprecate-isnumeric");
  addSnippet("jquery", "deprecate-iswindow");
  addSnippet("jquery", "deprecate-now");
  addSnippet("jquery", "deprecate-parsejson");
  addSnippet("jquery", "deprecate-unique");
});
