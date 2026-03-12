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

  const button = $("#loadmore a");
  let maxPages = button.data("max_pages"),
      paged = button.data("paged");

  button.click(function (event) {
    event.preventDefault();

    if (!$("body").hasClass("loading")) {
      $.ajax({
        type: "POST",
        url: serhii.ajax_url,
        data: {
          paged: paged,
          action: "loadmore",
          taxonomy: button.data("taxonomy"),
          term_id: button.data("term-id"),
          pagenumlink: button.data("pagenumlink"),
        },
        dataType: "json",
        beforeSend: function (xhr) {
          console.log("taxonomy", button.data("taxonomy"));
          button.text("Loading...");
          $("body").addClass("loading");
        },
        success: function (data) {
          paged = data.paged;
          maxPages = data.max_pages;

          button.parent().before(data.posts);
          $("#pagination").html(data.pagination);
          button.text("Load more");

          if (paged >= maxPages) {
            button.remove();
          }
          $("body").removeClass("loading");
        },
      });
    }
  });
});
