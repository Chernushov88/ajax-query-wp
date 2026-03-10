jQuery(function ($) {
  $(".change-views").on("blur", function () {
    const input = $(this);
    const message = input.next();

    const oldValue = input.attr("value");

    $.ajax({
      type: "POST",
      url: ajaxurl, // localhost/wp-admin/admin-ajax.php
      data: {
        action: "truechangeviews",
        post_id: input.data("id"),
        views: input.val(),
        token: input.data("token"),
      },
      beforeSend: function () {
        message.text("Saving...").css("color", "blue").show();
      },
      success: function (response) {
        if (response.includes("negative") || response.includes("Security")) {
          message.text(response).css("color", "red");
          // Повертаємо старе значення в інпут через 1 сек
          setTimeout(() => {
            input.val(oldValue);
          }, 3000);
        } else {
          message.text(response).css("color", "green");
          // Оновлюємо атрибут value, щоб наступний "відкат" був до актуального числа
          input.attr("value", input.val());
        }

        setTimeout(function () {
          message.fadeOut();
        }, 5000);
      },
      error: function () {
        message.text("Error 400").addClass("text-error");
      },
    });
  });
});
