new Synvert.Rewriter("sass", "convert-to-scss", () => {
  configure({ parser: Synvert.Parser.GONZALES_PE });

  description(`
    Convert sass to scss

    \`\`\`sass
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
    \`\`\`

    =>

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
  `);

  withinFiles(Synvert.ALL_SASS_FILES, function () {
    findNode(".atrule .string", () => {
      insert(";", { at: "end" });
    });

    findNode(".declaration, .include", () => {
      insert(";", { at: "end", conflictPosition: -99 });
    });

    findNode(".mixin .operator", () => {
      replaceWith("@mixin ");
    });

    findNode(".include .operator", () => {
      replaceWith("@include ");
    });

    findNode(".mixin", () => {
      const column = this.currentNode.start.column - 1;
      const conflictPosition = 1 - column;
      group(() => {
        insert(" {", { at: "end", to: "arguments" });
        insert(`}\n${" ".repeat(column)}`, {
          to: "block",
          at: "end",
          conflictPosition,
        });
      });
    });

    findNode(".ruleset", () => {
      const column = this.currentNode.start.column - 1;
      const conflictPosition = 1 - column;
      group(() => {
        insert(" {", { at: "end", to: "selector" });
        insert(`\n${" ".repeat(column)}}`, {
          to: "block",
          at: "end",
          conflictPosition,
        });
      });
    });
  });

  // Do in another Rewriter to make sure it renames file at the last step.
  renameFile(Synvert.ALL_SASS_FILES, (filePath) => filePath.replace(/\.sass$/, ".scss"));
});
