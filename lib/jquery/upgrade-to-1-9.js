new Synvert.Rewriter("jquery", "upgrade-to-1-9", () => {
  description(`
    Upgrade jquery to 1.9, see more here https://jquery.com/upgrade-guide/1.9/
  `);

  addSnippet("jquery", "ajax-events-attached-to-document");
  addSnippet("jquery", "deprecate-andself");
  addSnippet("jquery", "deprecate-die");
  addSnippet("jquery", "deprecate-hover");
  addSnippet("jquery", "deprecate-live");
  addSnippet("jquery", "deprecate-size");
  addSnippet("jquery", "prop-boolean-properties");
});
