
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
        //$homePage.show();
        //$forumPage.hide();
        location.reload();
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
    //tab selectors
    var $introduction = $('#tabs-1');
    var $tourist_attractions = $("#tabs-2");
    var $forum = $('#tabs-3');
    var $destinationName = $('#destinationName');


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


    $('#country-select > div img:not(#map)').click(function(){
        $searchResultContainer.hide();

        $.ajax({
            type: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'text/plain',
            },
            dataType: "json",
            url: "/region-cities/"+ $(this).attr('id'),
            success:
                function (data){
                    displayInfo(data);
                    console.log(JSON.stringify(data));
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
        event: "mouseover"
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



    function renderDestinationInfo (destinationInputVal) {
        $destinationName.empty();
        $introduction.empty();
        $tourist_attractions.empty();
        $forum.empty();

       $.ajax({
           type: "GET",
           headers: {
               'Accept': 'application/json',
               'Content-Type': 'text/plain',
           },
           dataType: "json",
           url: "/destination/"+ destinationInputVal,
           success:
               function (data){

                   console.log(JSON.stringify(data));

                   var destination = data.place_name.toUpperCase()+" - "+data.country_name.toUpperCase();
                   $destinationName.text(destination);
                   $introduction.html(data.introduction);
                   var tourist_attractions=data.tourist_attractions;

                   $.each(tourist_attractions, function(i,val){
                       $tourist_attractions.append("<p>"+val+"</p>")
                   })

                   var topics = data.topics;
                   $.each(topics, function(i, val) {
                       $forum.append("<div class='forumList'><a href='#'>"+val+"</a></div>");
                   })
                   $forum.append("<div><button class='gotoForumBtn'>go to forum</button></div>");

                   $(".gotoForumBtn").click(function(){
                       $homePage.hide();
                       $("#homePageLink").removeClass('active');
                       $("#forumPageLink").addClass('active');
                       renderDestinationTopics(data._id);
                       $forumPage.show();
                   })

               },
           error: function () {
               alert("Not found");
               console.log("Error. Information not found.");
           }

       })

    }

    //redirect to the forum page and render a full list of topics with short content, reply numbers...
    function renderDestinationTopics(id) {
        $.ajax({
            type: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'text/plain',
            },
            dataType: "json",
            url: "/destination-topics/"+id,
            success: function (data){
                $forumMainContainer.empty();
                renderTopics(data);
            },
            error: function () {
                console.log("error");
            }
        });

    }


    /*---------add a new topic------------*/
    var $addNewTopicForm = $("#addNewTopicForm");
    $('#addTopicBtn').click(function(){
        $addNewTopicForm.show();

        //TODO:add client side validation here, to check all input fields

        $("#submitNewTopicBtn").click(function(){
            var topic = $("#newTopic").val();
            var userId = $("#userId").val();
            var content = $("#newTopicContent").val();
            var destinationId = $("#topicDestinationSelect").val();
            var date = moment().format('DD MMMM YYYY, HH:mm');

            var newTopic = new window.hello.Topic(topic, userId, content, destinationId, date);

           console.log(newTopic);
            $.ajax({
                type: "post",
                dataType: "json",
                contentType : 'application/json',
                url: "/add-new-topic",
                data: JSON.stringify(newTopic),
                success: function(){console.log("post success")},
                error: function() {console.log("post fail")}
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
                renderTopics(data);
            },
            error: function() {
                console.log("error")
            }
        })

    })

    function renderTopics(data) {
        var topicList = data;
        $.each(topicList, function(i, val){
            var contentPreview = topicList[i].value.content.substr(0,300)+"...";
            $forumMainContainer.append("<div><h4><a href='#'>"+topicList[i].value.topic +"</a></h4>"
                +"<p>by "+topicList[i].value.userId+",\t"+topicList[i].value.date+",\t Reply Numbers: "+topicList[i].value.replies.length+"</p>"
                +"<p>"+contentPreview+"</p></div>");
        });
    }



})
