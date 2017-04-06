/*----------search a topic------------*/
$('#topicSearchBtn').click(function () {
    var topicSearchInput = $('#topicSearchInput').val();

    //TODO: client side input validation check

    $.ajax({
        type: "get",
        dataType: "json",
        contentType: 'application/json',
        url: "/topics/" + topicSearchInput,
        success: function (data) {
            //console.log(JSON.stringify(data));
            $forumMainContainer.empty();
            renderTopicList(data);
        },
        error: function () {
            console.log("error")
        }
    })

})


function renderTopicList(data) {
    var topicList = data;
    $.each(topicList, function (i, val) {
        var contentPreview = topicList[i].value.content.substr(0, 300) + "...";
        //var topicUrl = "/topic/"+topicList[i].value._id;
        $forumMainContainer.append("<div><h4><a href='#topic'>" + topicList[i].value.topic + "</a></h4>"
            + "<p>by " + topicList[i].value.userId + ",\t" + topicList[i].value.date + ",\t Reply Numbers: " + topicList[i].value.replies.length + "</p>"
            + "<p>" + contentPreview + "</p></div>");
    });

    //click topic name and render details of one topic
    $("#forumMainContainer div h4").click(function () {
        var topicName = $(this).text();

        $.ajax({
            type: "get",
            dataType: "json",
            contentType: 'application/json',
            url: "/topic/" + topicName.toLowerCase().replace(/\s/g, "_"),
            success: function (data) {
                //$forumMainContainer.empty();
                //TODO topic page css (reply btn, go back btn include)
                //$forumMainContainer.text(JSON.stringify(data));
                //console.log(JSON.stringify(data));
                populateForum(data);
            },
            error: function () {
                console.log("error")
            }
        })
    })
}
