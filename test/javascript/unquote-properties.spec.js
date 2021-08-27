const fs = require('fs')
const mock = require('mock-fs')
const Synvert = require("synvert-core")
require('../../lib/javascript/unquote-properties')

describe("Unquote properties", () => {
  const input = `
    var x = {
      'quotedProp': 1,
      unquotedProp: 2,
      'quoted-prop': 3,
      method() { return 4; },
      '_quotedProp': 5,
      '$quotedProp': 6,
      'ĦĔĽĻŎ': 7,
      'quoted prop': 8,
      'class': 9,
      1: 10,
      '2': 11,
      [Math.random()]() { return 'oh no'; },
      [Math.random()]: 13,
      ['quoted computed prop']: 14,
    };
  `
  const output = `
    var x = {
      quotedProp: 1,
      unquotedProp: 2,
      'quoted-prop': 3,
      method() { return 4; },
      _quotedProp: 5,
      $quotedProp: 6,
      ĦĔĽĻŎ: 7,
      'quoted prop': 8,
      class: 9,
      1: 10,
      2: 11,
      [Math.random()]() { return 'oh no'; },
      [Math.random()]: 13,
      ['quoted computed prop']: 14,
    };
  `
  beforeEach(() => {
    mock({ 'code.js': input })
  })
  afterEach(() => {
    mock.restore()
  })

  test("convert", () => {
    const rewriter = Synvert.Rewriter.fetch('javascript', 'unquoteProperties')
    rewriter.process()
    expect(fs.readFileSync('code.js', 'utf-8')).toEqual(output)
  })
})