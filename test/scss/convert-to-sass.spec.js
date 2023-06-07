const snippet = "scss/convert-to-sass";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  const input = `
    @import "../styles/imports";
    $col-primary: #f39900;
    @mixin center_horizontal() {
      display: flex;
      justify-content: center;
    }

    .container {
      @include center_horizontal();
      border: 1px solid darken($col-background, 10);

      .item {
        color: $col-primary;
      }
    }
  `;

  const output = `
    @import "../styles/imports"
    $col-primary: #f39900
    @mixin center_horizontal()
      display: flex
      justify-content: center

    .container
      @include center_horizontal()
      border: 1px solid darken($col-background, 10)

      .item
        color: $col-primary
  `;

  assertConvert({
    path: "code.scss",
    input,
    output,
    snippet,
    newPath: "code.sass",
  });
});
