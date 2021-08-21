const Synvert = require("synvert-core")

new Synvert.Rewriter("nodejs", "preferStringTrimStartEnd", function() {
  description(`
    const foo1 = bar.trimLeft();
    const foo2 = bar.trimRight();
    =>
    const foo1 = bar.trimStart();
    const foo2 = bar.trimEnd();
  `)

  withFiles('**/*.js', function() {
    withNode({ type: 'CallExpression', callee: { type: 'MemberExpression', property: 'trimLeft' } }, function() {
      replace('callee.property', { with: 'trimStart' })
    })
    withNode({ type: 'CallExpression', callee: { type: 'MemberExpression', property: 'trimRight' } }, function() {
      replace('callee.property', { with: 'trimEnd' })
    })
  })
})