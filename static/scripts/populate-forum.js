var replyHTML, nestedParity = 1, numComments, newCommentText,
    replyLink = "<u>Reply</u><div class='replyBox'><button class='postBtn'>Post</button><div contenteditable></div>";

$(function(){ populateForum(testForum); });



function populateForum( forum ) {
  numComments = forum.replies.length;

  $('#forumMainContainer').html('<h2>' + forum.topic + '<span>' + forum.userId + '</span></h2>');
  $('#forumMainContainer').append(addReply(JSON.parse(forum.replies)[0], 0));


  function addReply( reply, parity ) {
    replyHTML = "<div id='comment" + reply.commentId + "' class='nestedParity" + (1-parity) + "'>" + '<h3>';

    if (reply.commentId > 0)
      replyHTML += '<span>' + reply.points + "</span><img src='images/upvote.png'> ";

    replyHTML += reply.userId + '</h3><p>' + reply.replyContent + '</p>' + replyLink + '</div>';

    for (var i in reply.children.sort(function(a,b){return forum.replies[b].points - forum.replies[a].points}))
      replyHTML += addReply(JSON.parse(forum.replies)[reply.children[i]], 1-parity);
 
    return replyHTML + '</div>';
  }


  resetCommentListeners();

}




function resetCommentListeners() {

  $('u').unbind();
  $('.postBtn').unbind();

  $('u').click(function(){
    $('u').show();
    $('.replyBox').hide();
    $(this).hide();
    $(this).parent().find('>.replyBox').show();
    $(this).parent().find('>.replyBox div').focus();
  });


  $('.postBtn').click(function(){
    $('u').show();
    $(this).parent().hide();
    if ($(this).parent().find('div').html() == '') return;
      
    newCommentText = $(this).parent().find('div').html();
    $(this).parent().find('div').html('');

    numComments++;
    parentParity = $(this).parent().parent().attr('class').slice(-1);

    $(this).parent().after("<div id='comment" + numComments + "' class='nestedParity" + (1-parentParity) + "'><h3><span>0</span><img src='images/upvote.png'> " + testProfile._id + '</h3><p>' + newCommentText + '</p>' + replyLink + '</div>');

    resetCommentListeners();

    // TODO: function here to post comment to database

  });


  $('#forumMainContainer img').click(function(){
    $(this).parent().find('span').css({
      'color': '#0F0',
      'text-shadow': '0 1px 1px black'
    });
    $(this).attr('src','images/downvote.png');
  });
}




// example data only
/*var testForum = {
  '_id': 'suggest_dinner_restaurant_for_first_night_in_london',
  '_rev': 'blerahrgjhegahg',
  'date': '24 March 2017, 22:39',
  'destinationId': 'London',
  'replies': [
    // special first entry: original question
    {
      userId: '',
      replyContent: 'My partner and I are spending a few weeks in and around London next month. Does anyone know of any good restaurants near our hotel, the ...',

      // new fields
      'points': 29,
      'commentId': 0,
      'children': [1, 2, 3]
    } ,{
      userId: 'NickR',
      replyDate: '25 March 2017, 09:22',
      replyContent: 'Herman Ze German Villiers St is great fun and lovely food ......not British I hasten to add but a stone\'s throw from your hotel.....worth a ...',

      // new fields
      'points': 10,
      'commentId': 1,
      'children': [4, 6]
    }, {
      userId: 'OnlyPlacesilike',
      replyDate: '25 March 2017, 10:19',
      replyContent: 'As its a week night you could walk towards the city of London and eat at the Paternoster chop house, on paternoster square in the shadow of ...',
      'points': 4,
      'commentId': 2,
      'children': [5]
    }, {
      userId: 'Gehrig',
      replyDate: '25 March 2017, 04:22',
      replyContent: 'We had a great meal at Rules last month. Although it is quite British and proper, we were dressed smart casual and were not out of place. Do...',
      'points': 8,
      'commentId': 3,
      'children': []
    }, {
      userId: 'Yusef',
      replyDate: '26 March 2017, 18:51',
      replyContent: 'I\'ve been to Herman\'s. Would highly recommend to anyone searching for a more interesting cuisine. Great Beer selection.',
      'points': 4,
      'commentId': 4,
      'children': [8]
    }, {
      userId: 'ajs38',
      replyDate: '28 March 2017, 09:23',
      replyContent: 'We had a great meal at Rules last month. Although it is quite British and proper, we were dressed smart casual and were not out of place. Do...',
      'points': 1,
      'commentId': 5,
      'children': [7]
    }, {
      userId: 'yz62',
      replyDate: '27 March 2017, 12:48',
      replyContent: 'Herman\'s can sometimes take a long time to serve your food, but worth it if you\'re prepared to wait',
      'points': 2,
      'commentId': 6,
      'children': []
    }, {
      userId: 'Kasim',
      replyDate: '30 March 2017, 14:16',
      replyContent: 'I also had a very nice time at Rules. Would definitely recommend!',
      'points': 0,
      'commentId': 7,
      'children': []
    }, {
      userId: 'NickR',
      replyDate: '26 March 2017, 19:16',
      replyContent: 'Agree about the beer. Which one did you get?',
      'points': 1,
      'commentId': 8,
      'children': [9]
    }, {
      userId: 'Yusef',
      replyDate: '30 March 2017, 20:03',
      replyContent: 'I think it was a Berliner Weisse',
      'points': 0,
      'commentId': 9,
      'children': []
    }
  ],
  'topic': 'Suggest Dinner Restaurant for First Night in London',
  'userId': 'RachelH'
}



// example data only
var testProfile = {
  '_id': 'ajs38',
  '_rev': 'blerahrgygjal67384ahg',
  'startDate': 'March 2017',
  'favouritePlaces': [
    'London',
    'Paris',
    'St Andrews',
    'Melbourne',
    'Cupar',
    'Edinburgh',
    'New York',
    'Lilongwe',
    'Dedza',
    'Prague'
  ],
  'posts': [
    {
      'postId': 'suggest_dinner_restaurant_for_first_night_in_london',
      'commentId': 5
    }, {
      
    }, {
      
    }
  ]
}*/
