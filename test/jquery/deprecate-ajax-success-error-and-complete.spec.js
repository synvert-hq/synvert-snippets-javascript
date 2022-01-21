require("../../lib/jquery/deprecate-ajax-success-error-and-complete");
const { assertConvert } = require("../utils");

describe("jquery/deprecate-ajax-success-error-and-complete", () => {
  assertConvert({
    input: `
      $.ajax({
        url: 'URL',
        type: 'POST',
        data: yourData,
        datatype: 'json',
        success: function (data) {
          successFunction(data);
        },
        error: function (jqXHR, textStatus, errorThrown) { errorFunction(); }
      });
    `,
    output: `
      $.ajax({
        url: 'URL',
        type: 'POST',
        data: yourData,
        datatype: 'json',
      })
      .done(function (data) {
        successFunction(data);
      })
      .fail(function (jqXHR, textStatus, errorThrown) { errorFunction(); });
    `,
    snippet: "jquery/deprecate-ajax-success-error-and-complete",
  });
});