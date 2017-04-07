//set universal variables and selectors
var locationId;
var $profileMainContainer = $('#profileMainContainer');
var username;

// to show logged-in user's profile
$("#viewProfile a").click(function () {
    username = $(this).text();
    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'text/plain',
        },
        dataType: "json",
        url: "/user/" + username,
        success: function (data) {
            //console.log(data);
            populateProfile(data.value);
        },
        error: function () {
            console.log("error");
        }
    });


})


// create and fill user's profile window
function populateProfile(profile) {
    $profileMainContainer.show();
    showMask();

    // add title, bio, headers
    $profileMainContainer.html('<h2>' + profile.username + '<span>Member since ' + profile.startDate + '</span></h2>');
    $profileMainContainer.append("<div class='bio'>" + profile.bio + "</div>");
    $profileMainContainer.append('<h3>Favourite Places</h3>');

    // add label for each location in favouritePlaces
    for (var i in profile.favouritePlaces)
        $profileMainContainer.append('<span>' + profile.favouritePlaces[i] + '</span>');

    // header for recent posts
    $profileMainContainer.append('<h3></br>Most Recent Posts</h3>');

    // add line for each recent post (root post id, location id, or attraction id, as well as comment content)
    for (var i in profile.posts)
        $profileMainContainer.append("<div id='post" + i + "' class='post'><h4>" + initialUppercase(profile.posts[i].postId) + '</h4><p>' + profile.posts[i].postContent + '</p></div>');

    // add close button (cross) in top-right corner
    $profileMainContainer.append("<img src='./images/close.png' class='closeBtn'>");


    // buttons to edit profile
    $profileMainContainer.append("<button class='editBtn'>Edit</button>");
    $profileMainContainer.append("<div id='btngroup'><button class='saveBtn'>Save</button><button class='cancelBtn'>Cancel</button></div>");

    $profileMainContainer.append("<div id='demo'></div>");


    // click on one of the favouritePlaces to go to info for that location
    $('#profileMainContainer > span').click(function () {
      var locationId = $(this).text();
      $(this).parent().hide();
      hideMask();
      renderDestinationInfo(locationId.toLowerCase().replace(/\s/g, "_"));
      $("#search-result").show();
    });

    // get selectors
    var $bio = $('.bio');
    var $btngroup = $('#btngroup');
    var $editBtn = $('.editBtn');

    // to edit profile (remove favourite places, change bio)
    $editBtn.click(function() {
      $(this).hide();
      $btngroup.show();
      $bio.empty();
      var oldbio = profile.bio;
      $bio.append("<textarea cols='100' rows='4'>"+profile.bio+"</textarea>");
      $('#profileMainContainer > span').append("<img src='./images/close.png'>");
      $('#profileMainContainer > span').unbind();

      $('#profileMainContainer > span img').click(function() {
        $(this).parent().hide();
        $(this).parent().addClass("removed");
      })

      // change bio as the user types
      $('textarea').bind('input onpropertychange', function(){
        profile.bio = $(this).val();
      })

      // update when user clicks 'save'
      $('.saveBtn').click(function() {
        $bio.html(profile.bio);
        $('#profileMainContainer > span img').remove();
        $('.removed').remove();
        $btngroup.hide();
        $editBtn.show();

        saveNewProfile();
      })

      // discard changes when user clicks 'cancel'
      $('.cancelBtn').click(function() {
        $('#profileMainContainer > span img').remove();
        $('#profileMainContainer > span').show();
        $bio.html(oldbio);
        $btngroup.hide();
        $editBtn.show();
      })

    })


    // when cross is clicked, close the window
    $('.closeBtn').click(function () {
        $(this).parent().hide();
        hideMask();
    });

}


// update profile changes in database
function saveNewProfile() {
  var userId = $('#viewProfile').text();
  var newbio = $('.bio').html();
  var newfavouritePlaces = [];

  // get data to add
  $('#profileMainContainer > span').each(function(){
    newfavouritePlaces.push($(this).html());
  });

  // get existing user info
  $.ajax({
      type: "GET",
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'text/plain',
      },
      dataType: "json",
      url: "/user/" + username,
      success: function (data) {

        var posts = data.value.posts;

        // send new user info
        $.ajax
        ({
            type: "PUT",
            url: "/user/"+userId,
            dataType: 'text',
            contentType: 'application/json',
            data: JSON.stringify({
              "bio": newbio,
              "favouritePlaces": newfavouritePlaces,
              "posts": posts
            }),
            success: function () {
              console.log("profile updated");
            },
            error: function () {
              console.log("Failed to update profile");
            }
        });

      },
      error: function () {
        console.log("error");
      }
  });

}


// go to location info page (when one of favouritePlaces is clicked)
function showFavouriteCity() {
  var locationId = $(this).text();
  $(this).parent().hide();
  hideMask();
  renderDestinationInfo(locationId.toLowerCase().replace(/\s/g, "_"));
  $("#search-result").show();
}
