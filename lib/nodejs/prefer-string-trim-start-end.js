const Synvert = require("synvert-core")

new Synvert.Rewriter("nodejs", "preferStringTrimStartEnd", () => {
  description(`
    const foo1 = bar.trimLeft();
    const foo2 = bar.trimRight();
    =>
    const foo1 = bar.trimStart();
    const foo2 = bar.trimEnd();
  `)

  withFiles('**/*.js', () => {
    withNode({ type: 'CallExpression', callee: { type: 'MemberExpression', property: 'trimLeft' }, arguments: { length: 0 } }, () => {
      replace('callee.property', { with: 'trimStart' })
    })
    withNode({ type: 'CallExpression', callee: { type: 'MemberExpression', property: 'trimRight' }, arguments: { length: 0 } }, () => {
      replace('callee.property', { with: 'trimEnd' })
    })
  })
})