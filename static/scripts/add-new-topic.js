//Add a new topic to a location
function addNewTopic() {

    var topicId = $newTopicId.html();
    var userId = $("#viewProfile a").html();
    var content = $newTopicContent.html();
    var date = moment().format('DD MMMM YYYY, HH:mm');
    var replies = [{
      "userId": userId,
      "children": [],
      "points": 0,
      "replyContent": content,
      "commentId": 0
    }];
    var userPost = {
      "postId": destinationId,
      "postContent": content
    }

    //a post request to add a new topic to database
    $.ajax({
        type: "post",
        dataType: "text",
        contentType: 'application/json',
        url: "/topic",
        data: JSON.stringify({
          "_id": topicId.toLowerCase().replace(/\s/g,"_"),
          "topic": topicId,
          "userId": userId,
          "content": content,
          "destinationId": destinationId,
          "date": date,
          "type": "topic",
          "replies": replies
        }),
        success: function () {
          $addNewTopicForm.hide();
          $addNewTopicBtn.show();
          userNewPost(userPost);
        },
        error: function () {
          console.log("fail")
        }
    });
    $newTopicContent.html("");
    $newTopicId.html("");
}
