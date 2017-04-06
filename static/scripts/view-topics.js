var $topics = $("#tabs-2");


function renderTopicList(destinationName) {
  $topics.empty();

  $.ajax({
      type: "GET",
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'text/plain',
      },
      dataType: "json",
      url: "/destination/topics/"+ destinationName,
      success: function (data){

        var topicList = data;
        $.each(topicList, function(i, val){
            var forum = topicList[i].value;

            var contentPreview = topicList[i].value.content.substr(0,300)+"...";
            var topicHTML = "<div id='"+forum._id+"'>";
            topicHTML += "<h4>"+forum.topic+" <span> "+forum.userId+", "+forum.date+"</span></h4>";
            topicHTML += "<p>"+contentPreview+"</p></br>";
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
