require("../../lib/react/remove-unused-react-imports");
const { assertConvert } = require("../utils");

describe("Remove unused react imports", () => {
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
    path: "code.jsx",
    snippet: "react/removeUnusedReactImports",
  });
});
