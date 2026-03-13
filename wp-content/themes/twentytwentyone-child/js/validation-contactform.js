"use strict";

jQuery(function ($) {
  const $form = $("#contact-us-form");
  const $submitBtn = $form.find('button[type="submit"]');

  $form.on("submit", function (event) {
    if (!this.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      $form.addClass("was-validated");
      return false;
    }

    $form.addClass("was-validated");
    event.preventDefault();

    $.ajax({
      url: serhii.ajax_url,
      type: "POST",
      data: $form.serialize() + "&action=contactusform",
      beforeSend: function () {
        $submitBtn.prop("disabled", true).text("Loading...");
      },
      error: function (request, status, error) {
        $submitBtn.prop("disabled", false).text("Submit form");
      },
      success: function (data) {
        $submitBtn.prop("disabled", false).text("Submit form");
        $form.find(".form-control").val("");
        $form.removeClass("was-validated");
      },
    });
  });
});
