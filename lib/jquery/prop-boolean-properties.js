const Synvert = require("synvert-core");
const { InsertAction } = require("synvert-core/lib/action");

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

    jQuery.fn.removeAttr no longer sets boolean properties
    Cause: Prior to jQuery 3.0, using .removeAttr() on a boolean attribute such as checked, selected, or readonly would also set the corresponding named property to false. This behavior was required for ancient versions of Internet Explorer but is not correct for modern browsers because the attribute represents the initial value and the property represents the current (dynamic) value.

    Solution: It is almost always a mistake to use .removeAttr( "checked" ) on a DOM element. The only time it might be useful is if the DOM is later going to be serialized back to an HTML string. In all other cases, .prop( "checked", false ) should be used instead.
  `);

  const booleanProperties = ['checked', 'disabled', 'readonly', 'selected'];

  withinFiles(Synvert.ALL_FILES, function () {
    withNode({ type: "CallExpression", callee: { type: "MemberExpression", object: /^\$/, property: 'attr' }, arguments: { length: 2, first: { value: { in: booleanProperties } } } }, () => {
      replace('callee.property', { with: 'prop' });
      replace('arguments.1', { with: String(this.currentNode.arguments[1].value !== false) });
    });

    withNode({ type: "CallExpression", callee: { type: "MemberExpression", object: /^\$/, property: 'removeAttr' }, arguments: { length: 1, first: { value: { in: booleanProperties } } } }, () => {
      replace('callee.property', { with: 'prop' });
      insert(', false', { to: 'arguments.0', at: 'end' });
    });
  });
});
