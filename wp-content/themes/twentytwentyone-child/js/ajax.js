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
  /* ***
   * Found Posts
   */
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

  /* ***
   * Load More
   */
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

  /* ***
   * Comments
   */
  $("#commentform").submit(function () {
    let commentform = $(this);
    ((respond = $("#respond")), (commentList = $(".comment-list")));

    $.ajax({
      type: "POST",
      url: serhii.ajax_url,
      data: commentform.serialize() + "&action=sendcomment",
      beforeSend: function (xhr) {
        $("#submit").val("Send");
      },
      error: function (request, status, error) {
        // обрабатываем ошибки
        if (status == 500) {
          alert("Ошибка при добавлении комментария");
        } else if (status == "timeout") {
          alert("Ошибка: Сервер не отвечает, попробуй ещё.");
        } else {
          // ворпдрессовские ошибочки, не уверен, что это самый оптимальный вариант
          // если знаете способ получше - поделитесь
          var errormsg = request.responseText;
          var string1 = errormsg.split("<p>");
          var string2 = string1[1].split("</p>");
          // alert(string2[0]);
        }
      },
      success: function (newComment) {
        if ($(".comment-list li").length > 0) {
          if (respond.parent().hasClass("comment")) {
            if (respond.parent().children(".children").length > 0) {
              respond.parent().children(".children").append(newComment);
            } else {
              // если первый дочерний
              respond.after('<ol class="children">' + newComment + "</ol>");
            }
          } else {
            commentList.append(newComment);
          }
        } else {
          respond.before('<ol class="comment-list">' + newComment + "</ol>");
        }

        // очищаємо поле
        $("#comment").val("");

        // скидаємо parent
        $("#comment_parent").val("0");

        // ховаємо reply cancel
        $("#cancel-comment-reply-link").hide();

        // переносимо форму назад
        $(".comment-list").after(respond);

        $("#submit").val("Post comment");
        // $("submit").val("Post Comment");
      },
    });
    return false;
  });

  /* ***
   * Search
   */
  $("input[name='s']").autocomplete({
    source: function (request, response) {
      $.ajax({
        url: serhii.ajax_url,
        data: {
          action: "mywebsitesearch",
          term: request.term,
        },
        success: function (data) {
          response(data);
        },
      });
    },
    select: function (event, ui) {
      window.location = ui.item.url;
    },
  });
});
