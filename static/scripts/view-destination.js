var $destinationName = $('#destinationName');
var $visit = $('#tabs-1');
var $discussion = $("#tabs-2");


//render details of a place, including introduction, tourist attractions and some topics
function renderDestinationInfo(destinationInputVal) {
    $destinationName.empty();
    // leave map alone, delete everything else in $visit / #tabs-1
    $('#tabs-1 > *:not(#images)').remove();
    $discussion.empty();

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
            $destinationName.text(destination);
            //TODO: load image
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
                    url: "/destination/" + val.toLowerCase().replace(/\s/g, "_").replace("'", ""),
                    success: function (attraction) {
                        var imgUrl = '/destination/img/' + attraction._id + '.jpg';
                        $visit.append("<div class='tourist-attraction'><img src='" + imgUrl + "' style='width:15vw;border-radius:5px;border:none'><p>" + val + "</p></div>")
                    },
                    error: function (attraction) {
                        $visit.append("<div class='tourist-attraction'><p>" + val + "</p></div>")
                    }

                })

            })

            var topics = data.topics;
            $.each(topics, function (i, val) {
                $discussion.append("<div class='forumList'><a href='#'>" + val + "</a></div>");
            })
            $discussion.append("<div><button class='gotoForumBtn'>go to forum</button></div>");

            $(".gotoForumBtn").click(function () {
                $homePage.hide();
                $("#homePageLink").removeClass('active');
                $("#forumPageLink").addClass('active');
                renderDestinationTopics(data._id);
                $forumPage.show();
            })

        },
        error: function () {
            alert("Not found");
            console.log("Error. Information not found.");
        }

    })

}

//redirect to the forum page and render a full list of topics with short content, reply numbers...
function renderDestinationTopics(id) {
    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'text/plain',
        },
        dataType: "json",
        url: "/destination-topics/" + id,
        success: function (data) {
            $forumMainContainer.empty();
            renderTopicList(data);
        },
        error: function () {
            console.log("error");
        }
    });

}
