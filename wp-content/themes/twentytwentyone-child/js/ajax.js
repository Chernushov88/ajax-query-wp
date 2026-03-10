jQuery(function ($) {
  $("#true-get-id").submit(function (event) {
		event.preventDefault();
		
    const form = $(this);

    $.ajax({
      type: "POST",
      url: serhii.ajax_url,
      data: form.serialize(),
      beforeSend: function (xhr) {
        form.find("button").text("Loading...");
      },
      success: function (data) {
        $("#result").html(data);
        form.find("button").text("Submit");
      },
    });

    return false;
  });
});
