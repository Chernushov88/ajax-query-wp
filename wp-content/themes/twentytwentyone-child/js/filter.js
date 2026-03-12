jQuery(function ($) {
  $("#filter").submit(function (event) {
    event.preventDefault();
    const filter = $(this);

    $.ajax({
      url: serhii.ajax_url,
      data: filter.serialize(),
      action: "myfilter",
      type: "POST",
      beforeSend: function (xhr) {
        filter.find("button").text("Loading...");
      },
      success: function (data) {
        filter.find("button").text("Apply filter");
        $("#response").html(data);
      },
    });
    return false;
  });
});
