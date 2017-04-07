//get selectors
var $attractionContainer = $('#attractionMainContainer');

//initialise universal variables
var $addNewReviewBtn;
var $reviewBox;
var $newReviewContent;
var repliesArray;
var attraction_id;


//create and fill attraction review window
function populateTouristAttraction( attractionId ) {
  attraction_id = attractionId;

  //get data for attraction to be opened
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

         //reveal attraction review window
         showMask();
         $attractionContainer.show();

         //add fixed HTML (same structure for every attraction)
         $attractionContainer.html('<h2>' + initialUppercase(data._id) + '<span>' + data.cityName + '</span></h2>');
         $attractionContainer.append("<div id='imageContainer'><img src='/destination/img/" + data._id + ".jpg'></div>")
         $attractionContainer.append('<div>' + data.introduction + '</div></br></br>');
         $attractionContainer.append('<h3>Reviews</h3></br>');
         $attractionContainer.append(addNewReviewHTML);

         //set variables for element needed to add new review
         $addNewReviewBtn = $("#addNewReviewBtn");
         $reviewBox = $("#reviewBox");
         $newReviewContent = $("#reviewBox div");

         //handler to check user is logged in, then allow new review input
         $addNewReviewBtn.click(function(){
           $.ajax({
               type: "GET",
               headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'text/plain',
               },
               dataType: "json",
               url: "/checkLoginStatus",
               success: function (data){
                 //if logged in, hide button and show input field
                 $addNewReviewBtn.hide();
                 $reviewBox.show();
               },
               error: function (attraction) {
                 alert("Please log in to add topics")
               }

           });
         })

         //add existing reviews ('replies' in the database) to the window
         // array is used to hold the HTML in chunks
         // it will then be reordered depending on upvote numbers
         repliesArray = data.replies;
         $("#reviewBox button").click(addNewReview);

         var commentsHTML = [];
         var commentOrder = [];

         //populate the array with HTML chunks for each existing review
         for (var i in data.replies) {
           var commentHTML = "<div id='post" + i + "' class='post'>";
           commentHTML += "<h4><span>" + data.replies[i].points + "</span><img src='images/upvote.png'> " + data.replies[i].userId + "</h4>";
           commentHTML += "<p>" + data.replies[i].replyContent + '</p></div>';
           commentsHTML.push(commentHTML);
           commentOrder.push(i);
         }
         // then sort array depending on upvotes
         commentOrder.sort(function(a,b){return data.replies[b].points - data.replies[a].points});

         //write to web page
         for (var i in commentOrder)
           $attractionContainer.append(commentsHTML[commentOrder[i]]);

         //include close button (cross) in upper-right corner of window
         $attractionContainer.append("<img id='close' src='../images/close.png'>");

         //when cross is clicked, close the window
         $('#attractionMainContainer #close').click(function(){
           $(this).parent().hide();
           hideMask();
         });


         // when upvote- or downvote-post button is clicked
         $('#attractionMainContainer img:not(#close)').click(function(){

           var $this = $(this);
           var repliesArray = data.replies;

           // check user is logged in, then increase/decrease vote count
           $.ajax({
               type: "GET",
               headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'text/plain',
               },
               dataType: "json",
               url: "/checkLoginStatus",
               success: function (data){

                 //if logged in, get existing upvote score and comment id
                 var $upvoteScore = $this.parent().find('span');
                 var parentId = $this.parent().parent().attr('id').slice(4);

                 //check image to see if already upvoted that comment
                 // if not, then increase score
                 if ($this.attr('src') == 'images/upvote.png') {

                   // change image to reflect already upvoted
                   $this.attr('src','images/downvote.png');
                   var newUpvoteScore = Number($upvoteScore.html())+1;
                   // and change text format (green colour)
                   $upvoteScore.css({'color': '#0F0', 'text-shadow': '0 1px 1px black'});
                   repliesArray[parentId].points++;

                 // if already upvoted, decrease score (net contribution back to 0)
                 } else {

                   $this.attr('src','images/upvote.png');
                   var newUpvoteScore = Number($upvoteScore.html())-1;
                   $upvoteScore.css({'color': '#777', 'text-shadow': 'none'});
                   repliesArray[parentId].points--;
                 }

                 //change upvote score of that comment on the web page
                 $upvoteScore.html(newUpvoteScore);

                 //change upvote score of that comment in the database
                 $.ajax({
                     type: "PUT",
                     dataType: "text",
                     contentType: "application/json",
                     data: JSON.stringify({
                       "_id": forumId,
                       "repliesArray": repliesArray
                     }),
                     url: "/post/"+attractionId,
                     success: function (){
                       console.log("success", data);
                     },
                     error: function () {
                       console.log("error posting", data);
                     }

                 })

               },
               error: function (attraction) {
                 alert("Please log in to upvote posts")
               }

           })

         });

       },
     error: function () {
       alert("Not found");
     }

  })

}


//set listeners to open attraction review window
function resetAttractionListeners() {

  $('.tourist-attraction').click(function(){
    populateTouristAttraction($(this).attr('id'));
  });

}


//construct HTML string to create add-new-review button and input
var addNewReviewHTML = "<button id='addNewReviewBtn'>Add New Review</button>";
addNewReviewHTML += "<div id='reviewBox'><button>Post</button><div contenteditable></div>";
