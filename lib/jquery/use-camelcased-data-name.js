const Synvert = require("synvert-core");

new Synvert.Rewriter("jquery", "use-camelcased-data-name", () => {
  configure({ sourceType: 'script' });

  description(`
    JQMIGRATE: jQuery.data() always sets/gets camelCased names
    Cause: The page is attempting to set or get a jQuery data item using kebab case, e.g. my-data, when a my-data item has been set directly on the jQuery data object. jQuery 3.0 always exclusively uses camel case, e.g., myData, when it accesses data items via the .data() API and does not find kebab case data in that object.

    Solution: Either 1) Always use the .data() API to set or get data items, 2) Always use camelCase names when also setting properties directly on jQuery's data object, or 3) Always set properties directly on the data object without using the API call to set or get data by name. Never mix direct access to the data object and API calls with kebab case names.
  `);

  const camelize = (str) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/-/g, "");
  };

  withinFiles(Synvert.ALL_JS_FILES, function () {
    findNode(`.CallExpression[callee=.MemberExpression[object IN (/^\\$/ /^jQuery/)][property=data]]
                [arguments.length IN (1 2)][arguments.0=.Literal]`, () => {
      const dataKey = this.currentNode.arguments[0].value;
      const quote = this.currentNode.arguments[0].raw[0];
      if (dataKey.includes("-")) {
        replace("arguments.0", { with: quote + camelize(dataKey) + quote });
      }
    });
  });
});
