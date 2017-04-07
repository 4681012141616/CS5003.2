var $topics = $("#tabs-2");
var $addNewTopicBtn;
var $addNewTopicForm;
var $newTopicContent;
var $newTopicId;
var destinationId;


function renderTopicList(destinationName) {
  $topics.empty();
  destinationId = destinationName;

  $.ajax({
      type: "GET",
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'text/plain',
      },
      dataType: "json",
      url: "/destination/topics/"+ destinationName,
      success: function (data){

        $topics.html(addNewTopicHTML);

        var topicList = data;
        $.each(topicList, function(i, val){
            var forum = topicList[i].value;

            var contentPreview = topicList[i].value.content.substr(0,300)+"...";
            var topicHTML = "<div id='"+forum._id+"'>";
            topicHTML += "<h4>"+forum.topic+" <span> "+forum.userId+", "+forum.date+"</span></h4>";
            topicHTML += "<p>"+contentPreview+"</p>";
            topicHTML += "<p>"+forum.replies.length+" Replies</p></div></br></br>";
            $topics.append(topicHTML);

            //click topic name and render details of one topic
            $("#"+forum._id).click(function() {
              populateForum(forum);
            })

            $addNewTopicBtn = $("#addNewTopicBtn");
            $addNewTopicForm = $("#addNewTopicForm");
            $newTopicContent = $("#newTopicContent");
            $newTopicId = $("#newTopicId");

            $addNewTopicBtn.click(function(){
              $.ajax({
                  type: "GET",
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'text/plain',
                  },
                  dataType: "json",
                  url: "/checkLoginStatus",
                  success: function (data){
                    $addNewTopicBtn.hide();
                    $addNewTopicForm.show();
                  },
                  error: function (attraction) {
                    alert("Please log in to add topics")
                  }

              });
            })

            $("#addNewTopicForm button").click(addNewTopic);

        });

      },
      error: function (attraction) {
          console.log("Failed to load topic")
      }
  })

}



var addNewTopicHTML = "<button id='addNewTopicBtn'>Add New Topic</button>";
addNewTopicHTML += "<div id='addNewTopicForm'>";
addNewTopicHTML += "<p>Title:</p><div id='newTopicId' contenteditable></div>";
addNewTopicHTML += "<p>Your Question, Advice, or Discovery:</p><div id='newTopicContent' contenteditable></div>";
addNewTopicHTML += "<button>Post</button></div>";
