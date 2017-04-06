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
        populateProfile(data.value);
      },
      error: function () {
          console.log("error");
      }
  });


})

function populateProfile( profile ) {
  $('#profileMainContainer').show();
  showMask();

  $('#profileMainContainer').html('<h2>' + profile.username + '<span>Member since ' + profile.startDate + '</span></h2>');
  $('#profileMainContainer').append('<div>' + profile.bio + '</div>');
  $('#profileMainContainer').append('<h3>Favourite Places</h3>');

  for (var i in profile.favouritePlaces)
    $('#profileMainContainer').append('<span>' + profile.favouritePlaces[i] + '</span>');

  $('#profileMainContainer').append('<h3></br>Most Recent Posts</h3>');

  for (var i in profile.posts)
    $('#profileMainContainer').append("<div id='post" + i + "' class='post'><h4>" + forums[profile.posts[i].postId] + '</h4><p>' + profile.posts[i].postContent + '</p></div>');

  $('#profileMainContainer').append("<img src='./images/close.png'>");



  $('#profileMainContainer > span').click(function(){

    locationId = $(this).text();

    // TODO: function here to open location page
  });


  $('#profileMainContainer img').click(function(){
    $(this).parent().hide();
    hideMask();
  });

}





// example data only


var forums = {
  'suggest_dinner_restaurant_for_first_night_in_london': 'Suggest Dinner Restaurant For First Night in London',
  'another_forum': 'Another Forum',
  'asked_a_question': 'Asked a Question'
}
