const Synvert = require("synvert-core")

new Synvert.Rewriter("javascript", "preferBindOperator", () => {
  description(`
    let x = this.foo.bind(this);
    =>
    let x = ::this.foo;
  `)

  withFiles('**/*.js', () => {
    withNode({ type: 'CallExpression', callee: { type: 'MemberExpression', object: { type: 'MemberExpression', object: { type: 'ThisExpression' } }, property: 'bind' }, arguments: { length: 1, 0: { type: 'ThisExpression' } } }, () => {
      replaceWith('::this.{{callee.object.property}}')
    })
  })
})