new Synvert.Rewriter("jquery", "upgrade-to-3-0", () => {
  description(`
    Upgrade jquery to 3.0, see more here https://jquery.com/upgrade-guide/3.0/
  `);

  addSnippet("jquery", "deprecate-andself");
  addSnippet("jquery", "deprecate-bind-unbind");
  addSnippet("jquery", "deprecate-delegate-undelegate");
  addSnippet("jquery", "deprecate-error");
  addSnippet("jquery", "deprecate-isfunction");
  addSnippet("jquery", "deprecate-jqxhr-methods");
  addSnippet("jquery", "deprecate-load-unload");
  addSnippet("jquery", "deprecate-parsejson");
  addSnippet("jquery", "deprecate-ready-event");
  addSnippet("jquery", "deprecate-removeattr-boolean-properties");
  addSnippet("jquery", "deprecate-size");
  addSnippet("jquery", "deprecate-unique");
  addSnippet("jquery", "quote-attribute-selector-with-number-sign");
  addSnippet("jquery", "use-expr-pseudos");
});
