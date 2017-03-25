
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



  var $destinationInput = $('#destinationInput');
    var $destinationInfo = $('#destination-info');
    var $searchResultContainer = $('#search-result');

    $('#tabs').tabs({
        event: "mouseover"
    });
    var $introduction = $('#tabs-1');
    var $tourist_attractions = $("#tabs-2");
    var $forum = $('#tabs-3');

    var availableTags = [
        "London",
        "Rome",
        "Beijing",
        "Edinburgh"
    ];

    $destinationInput.autocomplete({
        source: availableTags
    });

    $('#destinationSearchBtn').click(function(){

        //var $tabs = $("#tabs");
        $searchResultContainer.show();



        var destinationInputVal = $destinationInput.val().toLowerCase();


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
                    renderDestinationInfo(data);
                console.log(JSON.stringify(data));
                   // renderDestinationInfo(data);
                /*$("#tabs-1").html(data.introduction);
                $("#tabs-2").html(data.tourist_attractions);
                $("#tabs-3").html(data.topics);*/
            },
            error: function () {
                console.log("Error. Information not found.");
            }

        })
    })

   function renderDestinationInfo (data) {
       var destination = data.city_name.toUpperCase()+" - "+data.country_name.toUpperCase();
       $("#search-result h3").text(destination);
        $introduction.html(data.introduction);
        $tourist_attractions.html(data.tourist_attractions);
        var topics = data.topics;
        $.each(topics, function(i, val) {
            $forum.append("<div class='forumList'><a href='#'>"+val+"</a></div>");
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
