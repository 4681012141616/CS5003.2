var locationId;

$("#viewProfile a").click(function(){
  var username = $(this).text();
  console.log(username);
  $.ajax({
      type: "GET",
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'text/plain',
      },
      dataType: "json",
      url: "/user/"+ username,
      success: function (data){
        console.log(data);
          populateProfile(data);
      },
      error: function () {
          console.log("error");
      }
  });


})



function populateProfile( profile ) {
  $('#profileMainContainer').show();

  $('#profileMainContainer').html('<h2>' + profile.username + '<span>Member since ' + profile.startDate + '</span></h2>');
  $('#profileMainContainer').append('<div>' + profile.bio + '</div>');
  $('#profileMainContainer').append('<h3>Favourite Places</h3>');

  for (var i in profile.favouritePlaces)
    $('#profileMainContainer').append('<span>' + profile.favouritePlaces[i] + '</span>');

  $('#profileMainContainer').append('<h3></br>Most Recent Posts</h3>');

  for (var i in profile.posts)
    $('#profileMainContainer').append("<div id='post" + i + "' class='post'><h4>" + forums[profile.posts[i].postId] + '</h4><p>' + profile.posts[i].postContent + '</p></div>');

  $('#profileMainContainer').append("<img src='images/close.png'>");



  $('#profileMainContainer > span').click(function(){

    locationId = $(this).text();

    // TODO: function here to open location page
  });


  $('#profileMainContainer img').click(function(){
    $(this).parent().hide();
  });

}





// example data only
var testProfile = {
  '_id': 'ajs38',
  '_rev': 'blerahrgygjal67384ahg',
  'startDate': 'March 2017',
  'bio': 'Site co-founder. Avid traveller. Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah.',
  'favouritePlaces': [
    'London',
    'Paris',
    'St&nbsp;Andrews',
    'Melbourne',
    'Cupar',
    'Edinburgh',
    'New&nbsp;York',
    'Lilongwe',
    'Dedza',
    'Prague'
  ],
  'posts': [
    {
      'postId': 'suggest_dinner_restaurant_for_first_night_in_london',
      'commentId': 5,
      'postContent': 'We had a great meal at Rules last month. Although it is quite British and proper, we were dressed smart casual and were not out of place. Do...'
    }, {
      'postId': 'another_forum',
      'commentId': 17,
      'postContent': "I'd probably go for the thing"
    }, {
      'postId': 'asked_a_question',
      'commentId': 0,
      'postContent': "I'm going to Santa Cruz in Tenerife this Easter. Does anyone know the best way to climb to the top of the island from there?"
    }
  ]
}


var forums = {
  'suggest_dinner_restaurant_for_first_night_in_london': 'Suggest Dinner Restaurant For First Night in London',
  'another_forum': 'Another Forum',
  'asked_a_question': 'Asked a Question'
}
