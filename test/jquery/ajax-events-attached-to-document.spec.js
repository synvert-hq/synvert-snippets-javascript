const snippet = "jquery/ajax-events-attached-to-document";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `$("#status").ajaxStart(function(){ $(this).text("Ajax started"); });`,
    output: `$(document).ajaxStart(function(){ $("#status").text("Ajax started"); });`,
    snippet,
  });
});
