var $topics = $("#tabs-2");
var $addNewTopicBtn;
var $addNewTopicForm;
var $newTopicContent;
var $newTopicId;
var destinationId;

//render a list of topics given the name of the destination
function renderTopicList(destinationName) {
  $topics.empty();
  destinationId = destinationName;
  // make a get request to fetch the data of the topics
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
        $addNewTopicBtn = $("#addNewTopicBtn");
        $addNewTopicForm = $("#addNewTopicForm");
        $newTopicContent = $("#newTopicContent");
        $newTopicId = $("#newTopicId");

        // click a the add a new topic button to create a new topic
        $addNewTopicBtn.click(function(){
          // login status is checked before enabling editing
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
        // call the add a new topic function (in add-new-topic.js)
        $("#addNewTopicForm button").click(addNewTopic);

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

        });

      },
      error: function (attraction) {
          console.log("Failed to load topic")
      }
  })

}

// html elements show when the topics are retireved successfully
var addNewTopicHTML = "<button id='addNewTopicBtn'>Add New Topic</button>";
addNewTopicHTML += "<div id='addNewTopicForm'>";
addNewTopicHTML += "<p>Title:</p><div id='newTopicId' contenteditable></div>";
addNewTopicHTML += "<p>Your Question, Advice, or Discovery:</p><div id='newTopicContent' contenteditable></div>";
addNewTopicHTML += "<button>Post</button></div>";
