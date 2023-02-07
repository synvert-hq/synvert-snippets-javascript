new Synvert.Rewriter("javascript", "convert-commonjs-to-esm", () => {
  description(`
    Prefer using the JavaScript module format over the legacy CommonJS module format
  `);

  addSnippet("javascript", "forbid-use-strict");
  addSnippet("javascript", "prefer-import-export");
});
