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
    withNode({ type: 'CallExpression', callee: { type: 'MemberExpression', property: 'trimLeft' } }, () => {
      replace('callee.property', { with: 'trimStart' })
    })
    withNode({ type: 'CallExpression', callee: { type: 'MemberExpression', property: 'trimRight' } }, () => {
      replace('callee.property', { with: 'trimEnd' })
    })
  })
})