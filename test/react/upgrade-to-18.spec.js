const snippet = "react/upgrade-to-18";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  const input = `
    const container = document.getElementById('root');
    ReactDOM.render(<App />, container);
  `;

  const output = `
    const container = document.getElementById('root');
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
  `;

  assertConvert({
    input,
    output,
    snippet,
    path: "code.jsx",
  });
});
