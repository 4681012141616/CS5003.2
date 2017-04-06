/*---------add a new topic------------*/
var $addNewTopicForm = $("#addNewTopicForm");
$('#addTopicBtn').click(function(){

    $forumMainContainer.empty();
    $addNewTopicForm.show();

    //TODO:add client side validation here, to check all input fields

    $("#submitNewTopicBtn").click(function(){
        var topic = $("#newTopic").val();
        var userId = $("#userId").val();
        var content = $("#newTopicContent").val();
        var destinationId = $("#topicDestinationSelect").val();
        var date = moment().format('DD MMMM YYYY, HH:mm');
        var replies = [];

        var newTopic = new window.hello.Topic(topic, userId, content, destinationId, date, replies).toJSON();
        console.log(newTopic);

        $.ajax({
            type: "post",
            dataType: "json",
            contentType : 'application/json',
            url: "/topic",
            data: JSON.stringify(newTopic),
            success: function(){
                console.log("success")

                $addNewTopicForm.hide();

                $( "#dialog-message" ).dialog({
                    modal: true,
                    buttons: {
                        Ok: function() {
                            $( this ).dialog( "close" );
                            $forumMainContainer.show();
                        }
                    }
                });

            },
            //TODO after submission go back page
            error: function() {
                console.log("fail")
            }
        });

    })
})