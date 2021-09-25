const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "convertCommonJSToESM", () => {
  description(`
    Prefer using the JavaScript module format over the legacy CommonJS module format
  `);

  addSnippet("javascript", "forbidUseStrict");
  addSnippet("javascript", "preferImportExport");
});
