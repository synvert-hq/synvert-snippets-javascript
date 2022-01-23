const Synvert = require("synvert-core");

new Synvert.Rewriter("jquery", "prop-boolean-properties", () => {
  description(`
    $this.attr('checked', 'checked');
    =>
    $this.prop('checked', true);

    $this.attr('disabled', true);
    =>
    $this.prop('disabled', true);

    $this.attr('readonly', false);
    =>
    $this.prop('readonly', false);

    $this.removeAttr('selected');
    =>
    $this.prop('selected', false);
  `);

  const booleanProperties = ['checked', 'disabled', 'readonly', 'selected'];

  withinFiles(Synvert.ALL_FILES, function () {
    withNode({ type: "CallExpression", callee: { type: "MemberExpression", object: { in: [/^\$/, /^jQuery/] }, property: 'attr' }, arguments: { length: 2, first: { value: { in: booleanProperties } } } }, () => {
      replace('callee.property', { with: 'prop' });
      replace('arguments.1', { with: String(this.currentNode.arguments[1].value !== false) });
    });
  });
});
