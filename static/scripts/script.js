
$(document).ready(function(){


  /*  $('#menu li a').click(function() {
        $('li a.active').removeClass('active');
        var $this = $(this);
        if (!$this.hasClass('active')) {
            $this.addClass('active');
        }
    });

    $("#homePageLink").click(function(){
        $homePage.show();
        $communityPage.hide();
        $mainContainer.hide();
        $map.css({"float":"none", "width":"100%"});

    })

    $("#communityPageLink").click(function(){
        $homePage.hide();
        $mainContainer.hide();
        $communityPage.show();
    })*/

    /*--------get selectors----------*/

    var $destinationInput = $('#destinationInput');
    var $destinationInfo = $('#destination-info');
    var $searchResultContainer = $('#search-result');


    /*---------------select-destionation on the map----------------------*/
    var infoShown = false;

    var $searchResultContainer = $('#search-result');

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
            console.log(selectedDestination);
            renderDestinationInfo(selectedDestination);
        })
    }


    /*-------show details-------*/
    //initiate tabs widget from jqueryUI
    $('#tabs').tabs({
        event: "mouseover"
    });


    //tab selectors
    var $introduction = $('#tabs-1');
    var $tourist_attractions = $("#tabs-2");
    var $forum = $('#tabs-3');


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

        $searchResultContainer.show();

        var destinationInputVal = $destinationInput.val().toLowerCase();

        renderDestinationInfo(destinationInputVal);

    })





    function renderDestinationInfo (destinationInputVal) {
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
                   $("#search-result h3").text(destination);
                   $introduction.html(data.introduction);
                   var tourist_attractions=data.tourist_attractions;
                   $tourist_attractions.empty();
                   $.each(tourist_attractions, function(i,val){
                       $tourist_attractions.append("<p>"+val+"</p>")
                   })
                   $forum.empty();
                   var topics = data.topics;
                   $.each(topics, function(i, val) {
                       $forum.append("<div class='forumList'><a href='#'>"+val+"</a></div>");
                   })

               },
           error: function () {
               console.log("Error. Information not found.");
           }

       })

    }






  /*$('#search').click(function() {
    //event.preventDefault();
    var searchTopic = $('#topic').val();
    var searchDestination =$('#destination').val();
    $.ajax({
       type: "GET",
       headers: {
           'Accept': 'application/json',
           'Content-Type': 'text/plain',
       },
       dataType: "json",
       url: "obj/"+searchTopic,
       //crossDomain: true,
       success: function (data){

         //console.log(dataset);
         $("#demo").text(JSON.stringify(data));
       },
       error: function () {
         console.log("error");
       }
   });


   $.ajax({
      type: "GET",
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'text/plain',
      },
      dataType: "json",
      url: "destination/"+searchDestination,
      //crossDomain: true,
      success: function (data){

        //console.log(dataset);
        $("#demo").text(JSON.stringify(data));
      },
      error: function () {
        console.log("error");
      }
  });
  })

$("#addPost").click(function(){
  var title = $('#postTitle').val();
  var destination = $('#postDes').val();
  var topic = $('#postTopic').val();
  var content = $('#postContent').val();

  var postData = {
    title: title,
    destionation: destination,
    topic: topic,
    body: content
  }

  $.ajax({
    type: "post",
    dataType: "json",
    contentType : 'application/json',
    url: "/post",
    data: JSON.stringify(postData),
    success: function(){console.log("successful")},
    error: function() {console.log("error")}
  });
})*/



})
