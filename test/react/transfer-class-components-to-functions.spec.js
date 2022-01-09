require("../../lib/react/transfer-class-components-to-functions");
const { assertConvert } = require("../utils");

describe("react/transfer-class-components-to-functions", () => {
  describe('simple compoment', () => {
    const input = `
      import React, { Component } from 'react';
      class MyComponent extends Component {
        render() {
          return <p>It works!</p>;
        }
      }
    `;

    const output = `
      import React from 'react';
      const MyComponent = () => {
        return <p>It works!</p>;
      }
    `;

    assertConvert({
      input,
      output,
      path: "code.jsx",
      snippet: "react/transfer-class-components-to-functions",
    });
  });

  describe('this.props', () => {
    const input = `
      import React, { Component } from 'react';
      class MyComponent extends Component {
        render() {
          return <p>Hi, {this.props.name}</p>;
        }
      }
    `;

    const output = `
      import React from 'react';
      const MyComponent = ({ name }) => {
        return <p>Hi, {name}</p>;
      }
    `;

    assertConvert({
      input,
      output,
      path: "code.jsx",
      snippet: "react/transfer-class-components-to-functions",
    });
  });

  describe('destruct this.props', () => {
    const input = `
      import React, { Component } from 'react';
      class MyComponent extends Component {
        render() {
          const { name } = this.props;
          return <p>Hi, {name}</p>;
        }
      }
    `;

    const output = `
      import React from 'react';
      const MyComponent = ({ name }) => {
        return <p>Hi, {name}</p>;
      }
    `;

    assertConvert({
      input,
      output,
      path: "code.jsx",
      snippet: "react/transfer-class-components-to-functions",
    });
  });

  describe('useState', () => {
    const input = `
      import React, { Component } from 'react';

      class MyComponent extends Component {
        state = { count: 0 };

        render() {
          const reset = () => this.setState({ count: 0 });
          const inc = () => this.setState({ count: this.state.count + 1 });
          return <p onClick={inc}>
            Total: {this.state.count}
          </p>;
        }
      }
    `;

    const output = `
      import React, { useState } from 'react';

      const MyComponent = () => {
        const [count, setCount] = useState(0);

        const reset = () => setCount(0);
        const inc = () => setCount(count + 1);
        return <p onClick={inc}>
          Total: {count}
        </p>;
      }
    `;

    assertConvert({
      input,
      output,
      path: "code.jsx",
      snippet: "react/transfer-class-components-to-functions",
    });
  });

  describe('other functions', () => {
    const input = `
      import React, { Component } from 'react';

      class MyComponent extends Component {
        state = { hover: false };

        mouseEnterHandler() {
          this.setState({ hover: true });
        }

        mouseLeaveHandler = () => {
          this.setState({ hover: false });
        }

        render() {
          return (
            <p onmouseover={this.mouseEnterHandler} onmouseleave={this.mouseLeaveHandler}>Test</p>
          );
        }
      }
    `;

    const output = `
      import React, { useState } from 'react';

      const MyComponent = () => {
        const [hover, setHover] = useState(false);

        const mouseEnterHandler = () => {
          setHover(true);
        }

        const mouseLeaveHandler = () => {
          setHover(false);
        }

        return (
          <p onmouseover={mouseEnterHandler} onmouseleave={mouseLeaveHandler}>Test</p>
        );
      }
    `;

    assertConvert({
      input,
      output,
      path: "code.jsx",
      snippet: "react/transfer-class-components-to-functions",
    });
  });
});
