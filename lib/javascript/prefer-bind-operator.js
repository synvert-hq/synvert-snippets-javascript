const Synvert = require("synvert-core")

new Synvert.Rewriter("javascript", "preferBindOperator", () => {
  description(`
    let x = this.foo.bind(this);
    =>
    let x = ::this.foo;
  `)

  withFiles('**/*.js', () => {
    withNode({ type: 'CallExpression', callee: { type: 'MemberExpression', object: { type: 'MemberExpression', object: 'this' }, property: 'bind' }, arguments: { length: 1, 0: 'this' } }, () => {
      insert('::', { at: 'beginning' })
      deleteNode(['callee.dot', 'callee.property', 'arguments'])
    })
  })
})