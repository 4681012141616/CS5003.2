var $attractionContainer = $('#attractionMainContainer');


function resetAttractionListeners() {

  $('.tourist-attraction').click(function(){
    populateTouristAttraction($(this).attr('id'));
  });

}


function populateTouristAttraction( attractionId ) {

  $.ajax({
     type: "GET",
     headers: {
         'Accept': 'application/json',
         'Content-Type': 'text/plain',
     },
     dataType: "json",
     url: "/destination/"+ attractionId,
     success:
         function (data){

           showMask();
           $attractionContainer.show();

           $attractionContainer.html('<h2>' + initialUppercase(data._id) + '<span>' + data.cityName + '</span></h2>');
           $attractionContainer.append("<div id='imageContainer'><img src='/destination/img/" + data._id + ".jpg'></div>")
           $attractionContainer.append('<div>' + data.introduction + '</div></br></br>');
           $attractionContainer.append('<h3>Reviews</h3>');

           var commentsHTML = [];
           var commentOrder = [];

           for (var i in data.replies) {
             var commentHTML = "<div id='post" + i + "' class='post'>";
             commentHTML += "<h4><span>" + data.replies[i].points + "</span><img src='images/upvote.png'> " + data.replies[i].userId + "</h4>";
             commentHTML += "<p>" + data.replies[i].replyContent + '</p></div>';
             commentsHTML.push(commentHTML);
             commentOrder.push(i);
           }

           commentOrder.sort(function(a,b){return data.replies[b].points - data.replies[a].points});

           for (var i in commentOrder)
             $attractionContainer.append(commentsHTML[commentOrder[i]]);


           $attractionContainer.append("<img id='close' src='../images/close.png'>");



           $('#attractionMainContainer > span').click(function(){

             locationId = $(this).text();

             // TODO: function here to open location page
           });


           $('#attractionMainContainer #close').click(function(){
             $(this).parent().hide();
             hideMask();
           });

         },
     error: function () {
         alert("Not found");
     }

  })

}
