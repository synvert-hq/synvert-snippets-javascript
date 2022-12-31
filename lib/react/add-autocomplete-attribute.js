const Synvert = require("synvert-core");

new Synvert.Rewriter("react", "add-autocomplete-attribute", () => {
  description(`
    Add autoComplete to input and Field element.

    \`\`\`javascript
    <input name="user[password]" type="password" />
    \`\`\`

    =>

    \`\`\`javascript
    <input name="user[password]" type="password" autoComplete="current-password" />
    \`\`\`

    \`\`\`javascript
    <Field
      name="new_password"
      type="password"
    />
    \`\`\`

    =>
    \`\`\`javascript
    <Field
      name="new_password"
      type="password"
      autoComplete="new-password"
    />
    \`\`\`
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  const PATTERNS = [
    { name: "email", type: "text", autoComplete: "email" },
    { name: "email", type: "email", autoComplete: "email" },
    { name: "password", type: "password", autoComplete: "current-password" },
    { name: "new_password", type: "password", autoComplete: "new-password" },
  ];
  withinFiles(Synvert.ALL_FILES, () => {
    for (const pattern of PATTERNS) {
      findNode(
        `.JsxSelfClosingElement
          [tagName IN (input Field)]
          [attributes=.JsxAttributes
            [properties not includes .JsxAttribute[name=autoComplete]]
            [properties includes .JsxAttribute[name=name][initializer=.StringLiteral[text*=${pattern.name}]]]
            [properties includes .JsxAttribute[name=type][initializer=.StringLiteral[text=${pattern.type}]]]
          ],
        .JsxOpeningElement
          [tagName IN (input Field)]
          [attributes=.JsxAttributes
            [properties not includes .JsxAttribute[name=autoComplete]]
            [properties includes .JsxAttribute[name=name][initializer=.StringLiteral[text*=${pattern.name}]]]
            [properties includes .JsxAttribute[name=type][initializer=.StringLiteral[text=${pattern.type}]]]
          ]`,
        function () {
          if (this.mutationAdapter.getSource(this.currentNode).trim().includes("\n")) {
            insertAfter(`  autoComplete="${pattern.autoComplete}"`, { to: "attributes.properties.-1" });
          } else {
            insert(` autoComplete="${pattern.autoComplete}"`, { to: "attributes.properties.-1", at: "end" });
          }
        }
      );
    }
  });
});
