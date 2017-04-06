
$(document).ready(function(){

    /*-------------------toggle between home page and forum page------------------*/

    var $homePage = $("#homePage");
    var $forumPage = $("#forumPage");

  $('#menu li a').click(function() {
        $('li a.active').removeClass('active');
        var $this = $(this);
        if (!$this.hasClass('active')) {
            $this.addClass('active');
        }
    });

    $("#homePageLink").click(function(){
        $homePage.show();
        $forumPage.hide();
        //location.reload();
    })

    $("#forumPageLink").click(function(){
        $homePage.hide();
        $forumPage.show();
    })

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


    /*----------search a topic------------*/
    $('#topicSearchBtn').click(function(){
        var topicSearchInput = $('#topicSearchInput').val();

        //TODO: client side input validation check

        $.ajax({
            type: "get",
            dataType: "json",
            contentType : 'application/json',
            url: "/topics/"+topicSearchInput,
            success: function(data){
                //console.log(JSON.stringify(data));
                $forumMainContainer.empty();
                renderTopicList(data);
            },
            error: function() {
                console.log("error")
            }
        })

    })



    function renderTopicList(data) {
        var topicList = data;
        $.each(topicList, function(i, val){
            var contentPreview = topicList[i].value.content.substr(0,300)+"...";
            //var topicUrl = "/topic/"+topicList[i].value._id;
            $forumMainContainer.append("<div><h4><a href='#topic'>"+topicList[i].value.topic +"</a></h4>"
                +"<p>by "+topicList[i].value.userId+",\t"+topicList[i].value.date+",\t Reply Numbers: "+topicList[i].value.replies.length+"</p>"
                +"<p>"+contentPreview+"</p></div>");
        });

        //click topic name and render details of one topic
        $("#forumMainContainer div h4").click(function() {
            var topicName = $(this).text();

            $.ajax({
                type: "get",
                dataType: "json",
                contentType : 'application/json',
                url: "/topic/"+topicName.toLowerCase().replace(/\s/g,"_"),
                success: function(data){
                    //$forumMainContainer.empty();
                    //TODO topic page css (reply btn, go back btn include)
                    //$forumMainContainer.text(JSON.stringify(data));
                    //console.log(JSON.stringify(data));
                    populateForum(data);
                },
                error: function() {
                    console.log("error")
                }
            })
        })
    }



})
