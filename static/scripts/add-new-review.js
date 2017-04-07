//Add review to a tourist attraction
function addNewReview() {

    var content = $newReviewContent.html();
    var date = moment().format('DD MMMM YYYY, HH:mm');

    repliesArray.push({
      "userId": $("#viewProfile a").html(),
      "replyDate": date,
      "replyContent": content,
      "points": 0
    });

    var userPost = {
      "postId": attraction_id,
      "postContent": content
    }

    //Add review to user profile
    $.ajax({
        type: "put",
        dataType: "text",
        contentType: 'application/json',
        url: "/post/"+attraction_id,
        data: JSON.stringify({
          "_id": attraction_id,
          "repliesArray": repliesArray
        }),
        success: function () {
          $addNewReviewBtn.show();
          $reviewBox.hide();
          userNewPost(userPost)
        },
        error: function () {
          console.log("fail")
        }
    });

    $newReviewContent.html("");

}
