/*--------get selectors----------*/

var $destinationInput = $('#destinationInput');
var $destinationInfo = $('#destination-info');
var $searchResultContainer = $('#search-result');
var $forumMainContainer = $('#forumMainContainer');


/*---------------select-destionation on the map----------------------*/
var infoShown = false;


$(window).resize(resized);
$(resized);

function resized() {
    if ($(window).width() >= 900)
        $destinationInfo.css('width', .83 * $(window).width() - 600);
    else
        $destinationInfo.css('width', .88 * $(window).width() - 70);
}


$('#country-select > div img:not(#world-map)').click(function () {

    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'text/plain',
        },
        dataType: "json",
        url: "/destination/" + $(this).attr('id'),
        success: function (data) {
            displayInfo(data);
        },
        error: function () {
            console.log("Error. Information not found.");
        }

    })

    //displayInfo($(this).attr('id'));
});


function displayInfo(data) {
    if (!infoShown) {
        $destinationInfo.css({
            'color': '#1F1F60',
            'border-color': 'gray',
            'display': 'block',
            'text-align': 'left'
        });
        $('#destination-info div').show();
        $('#destination-info span').remove();
        infoShown = true;
    }
    $destinationInfo.children('h3, p').remove();
    for (var i in data.cities) {
        $destinationInfo.prepend('<p>' + initialUppercase(data.cities[i]) + '</p>');
    }
    $destinationInfo.prepend('<h3>' + data.fullName + '</h3>');
    //click on the city name
    $("#destination-info p").click(function () {
        $searchResultContainer.show();
        var selectedDestination = $(this).text().toLowerCase().replace(/\s/g, "_");
        renderDestinationInfo(selectedDestination);
        renderTopicList(selectedDestination);
    })
}


/*---------------------show details--------------*/
//initiate tabs widget from jqueryUI
$('#tabs').tabs({
    event: "click"
});


//input search and click on the search btn and render details of destination
$('#destinationSearchBtn').click(function () {
    searchDestination();
});

$destinationInput.keydown(function(e) {
    if(e.which === 13) {
        searchDestination();
    }
});


function searchDestination() {
    var destinationInputVal = $destinationInput.val().toLowerCase();
    if(!check_searchInput(destinationInputVal)) {
        alert("Invalid input");
    } else {
        renderDestinationInfo(destinationInputVal);
        $searchResultContainer.show();
    }
}


function check_searchInput(input) {
    if (input === "" || input == undefined || input.replace(/\s/g, "").length === 0 || input.match(/[^a-zA-Z]/)) {
        return false;
    }
    return true;
}


//get all place names in database for the autocomplete use
//auto complete widget from jqueryUI
var availablePlaceTags = [];
function loadPlaces() {
  $.ajax({
      type: "GET",
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'text/plain',
      },
      dataType: "json",
      url: "/cities",
      success: function(data) {
        $.each(data, function(i,val){
          availablePlaceTags.push(val.value.place_name)
        });
      },
      error: function () {
          console.log("error");
      }

  })
}

loadPlaces();

/*var availablePlaceTags = [
    "London",
    "Berlin",
    "Belfast",
    "Prague"
];*/

$destinationInput.autocomplete({
    source: availablePlaceTags
});
