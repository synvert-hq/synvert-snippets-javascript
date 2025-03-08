const snippet = "react/add-autocomplete-attribute";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  describe("email", () => {
    const input = `
      <input name="email" type="email" />
      <Field name="email" type="email" />
    `;

    const output = `
      <input name="email" type="email" autoComplete="email" />
      <Field name="email" type="email" autoComplete="email" />
    `;

    assertConvert({
      input,
      output,
      snippet,
    });
  });

  describe("current-password", () => {
    const input = `
      <input name="user[password]" type="password" />
      <input name="user[password_confirmation]" type="password" />
      <Field name="password" type="password" />
    `;

    const output = `
      <input name="user[password]" type="password" autoComplete="current-password" />
      <input name="user[password_confirmation]" type="password" autoComplete="current-password" />
      <Field name="password" type="password" autoComplete="current-password" />
    `;

    assertConvert({
      input,
      output,
      snippet,
    });
  });

  describe("new-password", () => {
    const input = `
      <input
        name="user[new_password]"
        type="password"
      />
      <Field
        name="new_password"
        type="password"
      />
    `;

    const output = `
      <input
        name="user[new_password]"
        type="password"
        autoComplete="new-password"
      />
      <Field
        name="new_password"
        type="password"
        autoComplete="new-password"
      />
    `;

    assertConvert({
      input,
      output,
      snippet,
    });
  });
});
