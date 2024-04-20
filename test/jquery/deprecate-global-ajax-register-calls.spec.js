const snippet = "jquery/deprecate-global-ajax-register-calls";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `
      $(document).ajaxComplete(handler)
      $(document).ajaxError(handler)
      $(document).ajaxSend(handler)
      $(document).ajaxStart(handler)
      $(document).ajaxStop(handler)
      $(document).ajaxSuccess(handler)
    `,
    output: `
      $(document).on("ajaxComplete", handler)
      $(document).on("ajaxError", handler)
      $(document).on("ajaxSend", handler)
      $(document).on("ajaxStart", handler)
      $(document).on("ajaxStop", handler)
      $(document).on("ajaxSuccess", handler)
    `,
    snippet,
  });
});
