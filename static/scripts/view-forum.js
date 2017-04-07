//initialise variables
var replyHTML, nestedParity = 1, numComments, newCommentText,
    replyLink = "<u>Reply</u><div class='replyBox'><button class='postBtn'>Post</button><div contenteditable></div>";

//get selectors
var $forumContainer = $('#forumMainContainer');
var repliesArray;
var forumId;

// create and fill topic discussion window
function populateForum( forum ) {
  forumId = forum._id;

  //reveal window
  showMask();
  $forumContainer.show();

  // store existing number of comments
  // this will be used as the commentId of a new comment and incremented each time
  numComments = forum.replies.length;

  // add title and call recursive comment-rendering function
  $forumContainer.html('<h2>'+forum.topic+'<span>'+forum.userId+", "+forum.date+'</span></h2>');
  $forumContainer.append(addReply(forum.replies[0], 0));

  // add close button (cross) to top-right corner of window
  $forumContainer.append("<img id='close' src='../images/close.png'>");


  // recursive comment-generating function
  function addReply( reply, parity ) {

    // first is the content, userId, points, upvote button of the comment
    replyHTML = "<div id='comment"+reply.commentId+"' class='nestedParity"+(1-parity)+"'><h3>";

    if (reply.commentId > 0) {
      replyHTML += '<span>'+reply.points+"</span><img src='images/upvote.png'> ";
      replyHTML += reply.userId+"<i>, "+reply.replyDate+"</i>";
    }

    replyHTML += '</h3><p>'+reply.replyContent+'</p>'+replyLink+'</div>';

    // then call the function again on each of the comment's children
    // they will be created inside the div of their parent comment
    for (var i in reply.children.sort(function(a,b){return forum.replies[b].points-forum.replies[a].points}))
      replyHTML += addReply(forum.replies[reply.children[i]], 1-parity);

    // finally, close the parent div
    return replyHTML+'</div>';
  }

  // once added new HTML ...
  resetCommentListeners( forum.replies );

}



// reset listeners after adding new HTML elements
function resetCommentListeners( replies ) {
  repliesArray = replies;

  $('u').unbind();
  $('.postBtn').unbind();


  // to open up text box to type new comment
  $('u').click(function(){

    var $this = $(this);

    // check user is logged in, then show input field to add new comment
    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'text/plain',
        },
        dataType: "json",
        url: "/checkLoginStatus",
        success: function (data){

          $('u').show();
          $('.replyBox').hide();
          $this.hide();
          $this.parent().find('>.replyBox').show();
          $this.parent().find('>.replyBox div').focus();

        },
        error: function (attraction) {
          alert("Please log in to post comments")
        }

    })

  });


  // post a new comment
  $('.postBtn').click(function(){

    // hide input field and reset parent's 'reply' button
    $('u').show();
    $(this).parent().hide();
    if ($(this).parent().find('div').html() == '') return;

    newCommentText = $(this).parent().find('div').html();
    $(this).parent().find('div').html('');

    // check parity of nesting depth (for blue or white background)
    parentParity = $(this).parent().parent().attr('class').slice(-1);

    var commentHTML = "<div id='comment"+numComments;
    commentHTML += "' class='nestedParity"+(1-parentParity)+"'>";
    commentHTML += "<h3><span>0</span><img src='images/upvote.png'> "+$("#viewProfile").html()+'</h3>';
    commentHTML += '<p>'+newCommentText+'</p>'+replyLink+'</div>';

    // add the comment on the webpage
    $(this).parent().after(commentHTML);

    // get data to add to the database
    var parentId = $(this).parent().parent().attr('id').slice(7);

    repliesArray[parentId].children.push(numComments);

    repliesArray.push({
      "userId": $("#viewProfile a").html(),
      "commentId": numComments,
      "replyContent": newCommentText,
      "points": 0,
      "children": [],
      "replyDate": moment().format("DD MMMM YYYY, HH:mm")
    });

    var userPost = {
      "postId": forumId,
      "postContent": newCommentText
    }

    // add new comment to database: forum comments and user profile recent posts
    $.ajax({
        type: "PUT",
        dataType: "text",
        contentType: "application/json",
        data: JSON.stringify({
          "id": forumId,
          "repliesArray": repliesArray
        }),
        url: "/post/"+forumId,
        success: function (){
          userNewPost(userPost);
        },
        error: function () {
          console.log("error posting");
        }

    })

    numComments++;
    resetCommentListeners( repliesArray );

  });


  // upvote/downvote a comment
  $('#forumMainContainer img:not(#close)').click(function(){

    var $this = $(this);

    // check user is logged in, then upvote/downvote the comment
    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'text/plain',
        },
        dataType: "json",
        url: "/checkLoginStatus",
        success: function (data){

          // get existing score of comment and commentId
          var $upvoteScore = $this.parent().find('span');
          var parentId = $this.parent().parent().attr('id').slice(7);

          //check upvote/downvote image to see if already upvoted that comment
          // if not already upvoted, add one point
          if ($this.attr('src') == 'images/upvote.png') {

            // change image and css to reflect already upvoted
            $this.attr('src','images/downvote.png');
            var newUpvoteScore = Number($upvoteScore.html())+1;
            $upvoteScore.css({'color': '#0F0', 'text-shadow': '0 1px 1px black'});
            repliesArray[parentId].points++;

          // if already upvoted, minus 1 point (net contibution back to 0)
          } else {

            $this.attr('src','images/upvote.png');
            var newUpvoteScore = Number($upvoteScore.html())-1;
            $upvoteScore.css({'color': '#777', 'text-shadow': 'none'});
            repliesArray[parentId].points--;
          }

          $upvoteScore.html(newUpvoteScore);

          // send new upvote points to the database
          $.ajax({
              type: "PUT",
              dataType: "text",
              contentType: "application/json",
              data: JSON.stringify({
                "_id": forumId,
                "repliesArray": repliesArray
              }),
              url: "/post/"+forumId,
              success: function (){},
              error: function () {
                console.log("error posting");
              }

          })

        },
        error: function (attraction) {
          alert("Please log in to upvote comments")
        }

    })

  });

  // when cross is clicked, close the window
  $('#forumMainContainer #close').click(function(){
    $(this).parent().hide();
    hideMask();
  });
}
