new Synvert.Rewriter("jquery", "upgrade-to-1-8", () => {
  description(`
    Upgrade jquery to 1.8, see more here https://jquery.com/upgrade-guide/1.9/
  `);

  addSnippet("jquery", "deprecate-andself");
  addSnippet("jquery", "deprecate-bind-unbind");
  addSnippet("jquery", "deprecate-die");
  addSnippet("jquery", "deprecate-error");
  addSnippet("jquery", "deprecate-live");
  addSnippet("jquery", "deprecate-size");
});
