const fs = require("fs");
const mock = require("mock-fs");
const Synvert = require("synvert-core");
require("../../lib/javascript/trailing-comma");

describe("Trailing Comma", () => {
  const input = `
    const object = {
      hello: 'hello',
      allo: 'allo',
      hola: 'hola'
    };

    const object2 = {hello: 'hello', allo: 'allo', hola: 'hola'};

    const array = [
      'hello',
      'allo',
      'hola'
    ];

    const array2 = ['hello', 'allo', 'hola'];

    test({
      test: 'test'
    });
  `;
  const output = `
    const object = {
      hello: 'hello',
      allo: 'allo',
      hola: 'hola',
    };

    const object2 = {hello: 'hello', allo: 'allo', hola: 'hola'};

    const array = [
      'hello',
      'allo',
      'hola',
    ];

    const array2 = ['hello', 'allo', 'hola'];

    test({
      test: 'test',
    });
  `;
  beforeEach(() => {
    mock({ "code.js": input });
  });
  afterEach(() => {
    mock.restore();
  });

  test("convert", () => {
    const rewriter = Synvert.Rewriter.fetch("javascript", "trailingComma");
    rewriter.process();
    expect(fs.readFileSync("code.js", "utf-8")).toEqual(output);
  });
});
