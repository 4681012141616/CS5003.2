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


$('#country-select > div img:not(#world-map)').click(function(){

    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'text/plain',
        },
        dataType: "json",
        url: "/destination/"+ $(this).attr('id'),
        success:
            function (data){
                displayInfo(data);
            },
        error: function () {
            console.log("Error. Information not found.");
        }

    })

    //displayInfo($(this).attr('id'));
});


function displayInfo( data ) {
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
        $destinationInfo.prepend('<p>' + data.cities[i] + '</p>');
    }
    $destinationInfo.prepend('<h3>' + data.fullName + '</h3>');
    //click on the city name
    $("#destination-info p").click(function () {
        $searchResultContainer.show();
        var selectedDestination = $(this).text();
        renderDestinationInfo(selectedDestination);
    })
}


/*---------------------show details--------------*/
//initiate tabs widget from jqueryUI
$('#tabs').tabs({
    event: "click"
});

//auto complete widget from jqueryUI
var availablePlaceTags = [
    "London",
    "Berlin",
    "Belfast",
    "Prague"
];

$destinationInput.autocomplete({
    source: availablePlaceTags
});



//input search and click on the search btn and render details of destination
$('#destinationSearchBtn').click(function(){

    //TODO: client side input validation check

    var destinationInputVal = $destinationInput.val().toLowerCase();
    renderDestinationInfo(destinationInputVal);
    $searchResultContainer.show();
})