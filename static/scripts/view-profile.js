var locationId;
var $profileMainContainer = $('#profileMainContainer');

$("#viewProfile a").click(function () {
    var username = $(this).text();
    console.log(username);
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

function populateProfile(profile) {
    $profileMainContainer.show();
    showMask();

    $profileMainContainer.html('<h2>' + profile.username + '<span>Member since ' + profile.startDate + '</span></h2>');
    $profileMainContainer.append("<div class='bio'>" + profile.bio + "</div>");
    $profileMainContainer.append('<h3>Favourite Places</h3>');

    for (var i in profile.favouritePlaces)
        $profileMainContainer.append('<span>' + profile.favouritePlaces[i] + '</span>');

    $profileMainContainer.append('<h3></br>Most Recent Posts</h3>');

    for (var i in profile.posts)
        $profileMainContainer.append("<div id='post" + i + "' class='post'><h4>" + forums[profile.posts[i].postId] + '</h4><p>' + profile.posts[i].postContent + '</p></div>');

    $profileMainContainer.append("<img src='./images/close.png' class='closeBtn'>");


    $profileMainContainer.append("<button class='editBtn'>Edit</button>");
    $profileMainContainer.append("<div id='btngroup'><button class='saveBtn'>Save</button><button class='cancelBtn'>Cancel</button></div>");

$profileMainContainer.append("<div id='demo'></div>");


    $('#profileMainContainer > span').click(function () {
      var locationId = $(this).text();
      $(this).parent().hide();
      hideMask();
      renderDestinationInfo(locationId.toLowerCase().replace(/\s/g, "_"));
      $("#search-result").show();
    });

  var $bio = $('.bio');
  var $btngroup = $('#btngroup');
  var $editBtn = $('.editBtn');

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


      $('textarea').bind('input onpropertychange', function(){
        profile.bio = $(this).val();
      })

      $('.saveBtn').click(function() {
        $bio.html(profile.bio);
        $('#profileMainContainer > span img').remove();
        $('.removed').remove();
        $btngroup.hide();
        $editBtn.show();

        saveNewProfile();



      })

      $('.cancelBtn').click(function() {
        $('#profileMainContainer > span img').remove();
        $('#profileMainContainer > span').show();
        $bio.html(oldbio);
        $btngroup.hide();
        $editBtn.show();
      })

    })






    $('.closeBtn').click(function () {
        $(this).parent().hide();
        hideMask();
    });

}


function saveNewProfile() {
  var userId = $('#viewProfile').text();
  var newbio = $('.bio').html();
  var newfavouritePlaces = [];
  $('#profileMainContainer > span').each(function(){
    newfavouritePlaces.push($(this).html());
  });

  $.ajax
  ({
      type: "PUT",
      url: "/user/"+userId,
      dataType: 'text',
      contentType: 'application/json',
      data: JSON.stringify({"bio": newbio, "favouritePlaces": newfavouritePlaces}),
      success: function () {
        console.log("profile updated");
      },
      error: function () {
          console.log("Failed to update profile");
      }
  });
}

function showFavouriteCity() {
  var locationId = $(this).text();
  $(this).parent().hide();
  hideMask();
  renderDestinationInfo(locationId.toLowerCase().replace(/\s/g, "_"));
  $("#search-result").show();
}

// example data only


var forums = {
    'suggest_dinner_restaurant_for_first_night_in_london': 'Suggest Dinner Restaurant For First Night in London',
    'another_forum': 'Another Forum',
    'asked_a_question': 'Asked a Question'
}
