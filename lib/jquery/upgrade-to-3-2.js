new Synvert.Rewriter("jquery", "upgrade-to-3-2", () => {
  description(`
    Upgrade jquery to 3.2
  `);

  addSnippet("jquery", "deprecate-delegate-undelegate");
  addSnippet("jquery", "deprecate-isarray");
  addSnippet("jquery", "deprecate-nodename");
  addSnippet("jquery", "deprecate-parsejson");
  addSnippet("jquery", "deprecate-unique");
});
