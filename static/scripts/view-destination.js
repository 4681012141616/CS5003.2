//get selectors
var $destinationName = $('#destinationName');
var $visit = $('#tabs-1');


//render details of a place, including introduction, tourist attractions and some topics
function renderDestinationInfo(destinationInputVal) {
    $destinationName.empty();
    // leave map alone, delete everything else in $visit / #tabs-1
    $('#tabs-1 > *:not(#images)').remove();

    // get information, topics, attractoins for that location
    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'text/plain',
        },
        dataType: "json",
        url: "/destination/" + destinationInputVal,
        success: function (data) {

            var destination = data.place_name.toUpperCase() + ' - ' + data.country_name.toUpperCase();
            $destinationName.html(destination+ "<img src='./images/favicon.png' class='favicon'>");

            var imgUrl = '/destination/img/' + data._id + '.jpg';
            $('#tabs-1 > div > img').attr('src', imgUrl);

            showOnMap(data.latitude, data.longitude);
            google.maps.event.trigger(map, 'resize');

            $visit.append('<h4>Introduction</h4><p>' + data.introduction + '</p></br></br><h4>Tourist Attractions</h4>');

            var tourist_attractions = data.tourist_attractions;
            $.each(tourist_attractions, function (i, val) {

                $.ajax({
                    type: "GET",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'text/plain',
                    },
                    dataType: "json",
                    url: "/destination/"+ val.toLowerCase().replace(/\s/g,"_").replace("'",""),
                    success: function (attraction){
                        var imgUrl = '/destination/img/' + attraction._id + '.jpg';
                        $visit.append("<div id='" + attraction._id + " 'class='tourist-attraction'><img src='"+imgUrl+"' style='width:15vw;border-radius:5px;border:none'><p>"+val+"</p></div>")
                    },
                    error: function (attraction) {
                        $visit.append("<div class='tourist-attraction'><p>" + val + "</p></div>")
                    }

                })

            })

            addFavPlaces(destinationInputVal);

        },
        error: function () {
            alert("Not found");
            console.log("Error. Information not found.");
        }

    })




   setTimeout(function(){
     resetAttractionListeners();
   }, 500);

}


//add location to the user's favourites
function addFavPlaces(destinationInputVal) {
  var userId = $('#viewProfile').text();
  $('.favicon').click(function() {

    //don't need to check user is logged in, since nothing changes if they aren't
    // just GET existing user information and PUT back the updated version
    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'text/plain',
        },
        dataType: "json",
        url: "/user/"+ userId,
        success: function (data){

          // save existing information to variables for neatness
          // 'bio' and 'posts' will go straight through this function
          var favouritePlaces = data.value.favouritePlaces;
          var bio = data.value.bio;
          var posts = data.value.posts;
          favouritePlaces.push(initialUppercase(destinationInputVal));

          // code to remove repeat values from the array
          var tempFavouritePlaces = [];
          for (var i in favouritePlaces) {
            if (favouritePlaces.indexOf(favouritePlaces[i]) == i) {
              tempFavouritePlaces.push(favouritePlaces[i])
            }
          }
          favouritePlaces = tempFavouritePlaces;

          // update the database with new favourite place in the array
          // everything else remains the same
          $.ajax({
              type: "put",
              dataType: "text",
              contentType: 'application/json',
              url: "/user/"+ userId,
              data: JSON.stringify({
                "bio": bio,
                "favouritePlaces": favouritePlaces,
                "posts": posts
              }),
              success: function () {
                console.log("add favouriteplaces successfully")

              },
              error: function () {
                  console.log("fail to add fav places")
              }
          });

        },
        error: function () {
          alert("Please log in first");
           console.log("err");
        }

    })
  })
}
