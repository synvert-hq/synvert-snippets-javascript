const dedent = require("dedent");
const snippet = "sass/convert-to-scss";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  const input = dedent`
    @import "../styles/imports"
    $col-primary: #f39900
    =center_horizontal()
      display: flex
      justify-content: center
    .container
      +center_horizontal()
      border: 1px solid darken($col-background, 10)
      .item
        color: $col-primary
  `;

  const output = dedent`
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

  assertConvert({
    path: "code.sass",
    input,
    output,
    snippet,
    newPath: "code.scss",
  });
});
