const snippet = "react/remove-unused-react-imports";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  const input = `
    import React from 'react';

    function App() {
      return <h1>Hello World</h1>;
    }
  `;

  const output = `
    function App() {
      return <h1>Hello World</h1>;
    }
  `;

  assertConvert({
    input,
    output,
    snippet,
  });
});
