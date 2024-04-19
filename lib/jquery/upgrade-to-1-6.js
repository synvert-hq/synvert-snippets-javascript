new Synvert.Rewriter("jquery", "upgrade-to-1-6", () => {
  description(`
    Upgrade jquery to 1.6, see more here https://jquery.com/upgrade-guide/1.9/
  `);

  addSnippet("jquery", "prop-boolean-properties");
});
