const snippet = "jquery/deprecate-error";
require(`../../lib/${snippet}`);
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `$(this).error(function () { console.log('error') });`,
    output: `$(this).on('error', function () { console.log('error') });`,
    snippet,
  });
});
