/********** AJAX in JavaScript only **********/
// const form = document.getElementById("true-get-id");
// const result = document.getElementById("result");

// form.addEventListener("submit", (event) => {
//   event.preventDefault();
//   form.querySelector("button").textContent = "Sending a request...";

//   const request = new XMLHttpRequest();
//   request.open("POST", serhii.ajax_url, true);
//   request.send(new FormData(form));
//   request.onload = function () {
//     const resp = this.response;
//     result.innerHTML = resp;
//     form.querySelector("button").textContent = "Find out the title";
//   };
//   request.send();
// });

jQuery(function ($) {
  $("#true-get-id").submit(function (event) {
    event.preventDefault();

    const form = $(this);
    const postIdInput = form.find('input[name="post_id"]');
    const postIdValue = postIdInput.val().trim();

    postIdInput.removeClass("error");
    $("#result").removeClass("text-error");
    if (!postIdValue || isNaN(postIdValue) || parseInt(postIdValue) <= 0) {
      $("#result")
        .html("Please enter a valid numeric ID.")
        .addClass("text-error");
      postIdInput.addClass("error");
      return false;
    }

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
