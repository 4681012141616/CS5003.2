/*---------add a new topic------------*/
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

    $.ajax({
        type: "post",
        dataType: "json",
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

        },
        error: function () {
            console.log("fail")
        }
    });

    $newTopicContent.html("");
    $newTopicId.html("");

}
