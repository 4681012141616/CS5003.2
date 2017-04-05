
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

    /*--------get selectors----------*/

    var $destinationInput = $('#destinationInput');
    var $destinationInfo = $('#destination-info');
    var $searchResultContainer = $('#search-result');
    var $forumMainContainer = $('#forumMainContainer');


    /*---------------select-destionation on the map----------------------*/
    var infoShown = false;


    $(window).resize(resized);
    $(resized);

    function resized() {
        if ($(window).width() >= 900)
            $destinationInfo.css('width', .83 * $(window).width() - 600);
        else
            $destinationInfo.css('width', .88 * $(window).width() - 70);
    }


    $('#country-select > div img:not(#world-map)').click(function(){
        $searchResultContainer.hide();

        $.ajax({
            type: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'text/plain',
            },
            dataType: "json",
            url: "/destination/"+ $(this).attr('id'),
            success:
                function (data){
                    displayInfo(data);
                },
            error: function () {
                console.log("Error. Information not found.");
            }

        })

        //displayInfo($(this).attr('id'));
    });


    function displayInfo( data ) {
        if (!infoShown) {
            $destinationInfo.css({
                'color': '#1F1F60',
                'border-color': 'gray',
                'display': 'block',
                'text-align': 'left'
            });
            $('#destination-info div').show();
            $('#destination-info span').remove();
            infoShown = true;
        }
        $destinationInfo.children('h3, p').remove();
        for (var i in data.cities) {
            $destinationInfo.prepend('<p>' + data.cities[i] + '</p>');
        }
        $destinationInfo.prepend('<h3>' + data.fullName + '</h3>');
        //click on the city name
        $("#destination-info p").click(function () {
            $searchResultContainer.show();
            var selectedDestination = $(this).text();
            renderDestinationInfo(selectedDestination);
        })
    }


    /*---------------------show details--------------*/
    //initiate tabs widget from jqueryUI
    $('#tabs').tabs({
        event: "click"
    });

    //auto complete widget from jqueryUI
    var availablePlaceTags = [
        "London",
        "Berlin",
        "Belfast",
        "Prague"
    ];

    $destinationInput.autocomplete({
        source: availablePlaceTags
    });



    //input search and click on the search btn and render details of destination
    $('#destinationSearchBtn').click(function(){

        //TODO: client side input validation check

        var destinationInputVal = $destinationInput.val().toLowerCase();
        renderDestinationInfo(destinationInputVal);
        $searchResultContainer.show();
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
