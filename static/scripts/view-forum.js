var replyHTML, nestedParity = 1, numComments, newCommentText,
    replyLink = "<u>Reply</u><div class='replyBox'><button class='postBtn'>Post</button><div contenteditable></div>";

var $forumContainer = $('#forumMainContainer');
var repliesArray;
var forumId;


function populateForum( forum ) {
  forumId = forum._id;

  showMask();
  $forumContainer.show();

  numComments = forum.replies.length;

  $forumContainer.html('<h2>'+forum.topic+'<span>'+forum.userId+", "+forum.date+'</span></h2>');
  $forumContainer.append(addReply(forum.replies[0], 0));

  $forumContainer.append("<img id='close' src='../images/close.png'>");


  function addReply( reply, parity ) {
    replyHTML = "<div id='comment"+reply.commentId+"' class='nestedParity"+(1-parity)+"'><h3>";

    if (reply.commentId > 0) {
      replyHTML += '<span>'+reply.points+"</span><img src='images/upvote.png'> ";
      replyHTML += reply.userId+"<i>, "+reply.replyDate+"</i>";
    }

    replyHTML += '</h3><p>'+reply.replyContent+'</p>'+replyLink+'</div>';

    for (var i in reply.children.sort(function(a,b){return forum.replies[b].points-forum.replies[a].points}))
      replyHTML += addReply(forum.replies[reply.children[i]], 1-parity);

    return replyHTML+'</div>';
  }

  resetCommentListeners( forum.replies );

}




function resetCommentListeners( replies ) {
  repliesArray = replies;

  $('u').unbind();
  $('.postBtn').unbind();


  // open up text box to type new comment
  $('u').click(function(){

    var $this = $(this);

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
    $('u').show();
    $(this).parent().hide();
    if ($(this).parent().find('div').html() == '') return;

    newCommentText = $(this).parent().find('div').html();
    $(this).parent().find('div').html('');

    parentParity = $(this).parent().parent().attr('class').slice(-1);

    var commentHTML = "<div id='comment"+numComments;
    commentHTML += "' class='nestedParity"+(1-parentParity)+"'>";
    commentHTML += "<h3><span>0</span><img src='images/upvote.png'> "+$("#viewProfile").html()+'</h3>';
    commentHTML += '<p>'+newCommentText+'</p>'+replyLink+'</div>';
    $(this).parent().after(commentHTML);


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

    $.ajax({
        type: "PUT",
        dataType: "text",
        contentType: "application/json",
        data: JSON.stringify({
          "id": forumId,
          "repliesArray": repliesArray
        }),
        url: "/post/"+forumId,
        success: function (){},
        error: function () {
          console.log("error posting");
        }

    })

    numComments++;
    resetCommentListeners( repliesArray );

  });


  // upvote a comment
  $('#forumMainContainer img:not(#close)').click(function(){

    var $this = $(this);

    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'text/plain',
        },
        dataType: "json",
        url: "/checkLoginStatus",
        success: function (data){

          var $upvoteScore = $this.parent().find('span');
          var parentId = $this.parent().parent().attr('id').slice(7);

          if ($this.attr('src') == 'images/upvote.png') {

            $this.attr('src','images/downvote.png');
            var newUpvoteScore = Number($upvoteScore.html())+1;
            $upvoteScore.css({'color': '#0F0', 'text-shadow': '0 1px 1px black'});
            repliesArray[parentId].points++;

          } else {

            $this.attr('src','images/upvote.png');
            var newUpvoteScore = Number($upvoteScore.html())-1;
            $upvoteScore.css({'color': '#777', 'text-shadow': 'none'});
            repliesArray[parentId].points--;
          }

          $upvoteScore.html(newUpvoteScore);

          $.ajax({
              type: "PUT",
              dataType: "text",
              contentType: "application/json",
              data: JSON.stringify({
                "id": forumId,
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

  $('#forumMainContainer #close').click(function(){
    $(this).parent().hide();
    hideMask();
  });
}
