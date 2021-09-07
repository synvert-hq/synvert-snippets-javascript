require("../../lib/javascript/trailing-comma");
const { assertConvert } = require('../utils');

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

  assertConvert({
    input,
    output,
    snippet: "javascript/trailingComma"
  });
});
