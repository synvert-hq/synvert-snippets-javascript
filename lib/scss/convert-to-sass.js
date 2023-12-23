new Synvert.Rewriter("scss", "convert-to-sass", () => {
  configure({ parser: Synvert.Parser.GONZALES_PE });

  description(`
    Convert scss to sass

    \`\`\`scss
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
    \`\`\`

    =>

    \`\`\`sass
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
    \`\`\`
  `);

  withinFiles(Synvert.ALL_SCSS_FILES, function () {
    group(() => {
      findNode(".declarationDelimiter", () => {
        remove();
      });

      findNode(".block", () => {
        // prettier-ignore
        delete("leftCurlyBracket");
        // prettier-ignore
        delete("rightCurlyBracket", { wholeLine: true });
      });
    });
  });

  // Do in another Rewriter to make sure it renames file at the last step.
  renameFile(Synvert.ALL_SCSS_FILES, (filePath) => filePath.replace(/\.scss$/, ".sass"));
});
