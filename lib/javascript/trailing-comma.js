const Synvert = require("synvert-core")

new Synvert.Rewriter("javascript", "trailingComma", () => {
  description(` `)

  withFiles('**/*.js', () => {
    withNode({ type: 'ObjectExpression' }, function() {
      if (this.currentNode.loc.start.line !== this.currentNode.loc.end.line) {
        const lastProperty = this.currentNode.properties[this.currentNode.properties.length - 1]
        if (this.currentFileSource[lastProperty.end] !== ',') {
          gotoNode('properties.last', () => {
            insert(',', { at: 'end' })
          })
        }
      }
    })
    withNode({ type: 'ArrayExpression' }, function() {
      if (this.currentNode.loc.start.line !== this.currentNode.loc.end.line) {
        const lastElement = this.currentNode.elements[this.currentNode.elements.length - 1]
        if (this.currentFileSource[lastElement.end] !== ',') {
          gotoNode('elements.last', () => {
            insert(',', { at: 'end' })
          })
        }
      }
    })
  })
})