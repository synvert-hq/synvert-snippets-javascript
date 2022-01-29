require("../../lib/react/transfer-class-components-to-functions");
const { assertConvert } = require("../utils");

describe("react/transfer-class-components-to-functions", () => {
  describe("simple compoment", () => {
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

  describe("this.props", () => {
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

  describe("conflict prop name", () => {
    const input = `
      import React, { Component } from 'react';
      class MyComponent extends Component {
        handleClick = (e) => {
          this.props.handleClick(e);
        }

        render() {
          const { name } = this.props;
          return <button onClick={this.handleClick}>Hi, {name}</button>;
        }
      }
    `;

    const output = `
      import React from 'react';
      const MyComponent = ({ name, ...props }) => {
        const handleClick = (e) => {
          props.handleClick(e);
        }

        return <button onClick={handleClick}>Hi, {name}</button>;
      }
    `;

    assertConvert({
      input,
      output,
      path: "code.jsx",
      snippet: "react/transfer-class-components-to-functions",
    });
  });

  describe("useState", () => {
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

  describe("destruct this.state", () => {
    const input = `
      import React, { Component } from 'react';

      class MyComponent extends Component {
        state = { count: 0 };

        render() {
          const { count } = this.state;
          return <p>
            Total: {count}
          </p>;
        }
      }
    `;

    const output = `
      import React, { useState } from 'react';

      const MyComponent = () => {
        const [count, setCount] = useState(0);

        return <p>
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

  describe("comment lifecycle methods", () => {
    const input = `
      import React, { Component } from 'react';

      class MyComponent extends Component {
        componentDidMount() {
          console.log('component did mount')
        }

        componentDidUpdate() {
          console.log('component did update')
        }

        componentWillUnmount() {
          console.log('component will unmount')
        }
      }
    `;

    const output = `
      import React, { useEffect } from 'react';

      const MyComponent = () => {
        // Synvert TODO: convert lifecycle methods to useEffect by yourself
        // componentDidMount() {
        //   console.log('component did mount')
        // }
        // componentDidUpdate() {
        //   console.log('component did update')
        // }
        // componentWillUnmount() {
        //   console.log('component will unmount')
        // }
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
