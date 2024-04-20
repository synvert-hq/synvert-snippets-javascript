new Synvert.Rewriter("jquery", "upgrade-to-1-7", () => {
  description(`
    Upgrade jquery to 1.7, see more here https://jquery.com/upgrade-guide/1.9/
  `);

  addSnippet("jquery", "deprecate-die");
  addSnippet("jquery", "deprecate-live");
});
