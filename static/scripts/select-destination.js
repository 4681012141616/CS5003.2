/*---------------select-destionation on the map----------------------*/
var destinationInfo = $('#destination-info'), infoShown = false;

var $searchResultContainer = $('#search-result');

$(window).resize(resized);
$(resized);

function resized() {
  if ($(window).width() >= 900)
    destinationInfo.css('width', .83 * $(window).width() - 600);
  else
    destinationInfo.css('width', .88 * $(window).width() - 70);
}


$('#country-select > div img:not(#map)').click(function(){
  $searchResultContainer.hide();

  $.ajax({
    type: "GET",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'text/plain',
    },
    dataType: "json",
    url: "/region-cities/"+ $(this).attr('id'),
    success:
        function (data){
          displayInfo(data);
          console.log(JSON.stringify(data));
        },
    error: function () {
      console.log("Error. Information not found.");
    }

  })

  //displayInfo($(this).attr('id'));
});


function displayInfo( data ) {
  if (!infoShown) {
    destinationInfo.css({
      'color': '#1F1F60',
      'border-color': 'gray',
      'display': 'block',
      'text-align': 'left'
    });
    $('#destination-info div').show();
    $('#destination-info span').remove();
    infoShown = true;
  }
  destinationInfo.children('h3, p').remove();
  for (var i in data.cities)
    destinationInfo.prepend('<p>' + data.cities[i] + '</p>');
  destinationInfo.prepend('<h3>' + data.fullName + '</h3>');

}



/*var fullName = {
  'eu-east': 'Eastern Europe and Russia',
  'nordics': 'Nordic Countries',
  's-e-asia': 'Southeast Asia',
  'china': 'China',
  'africa': 'Africa',
  'middle-e': 'Middle East',
  'aus-nz': 'Oceania and the Pacific',
  'balkans': 'Balkans',
  'eu-central': 'Central Europe',
  'france': 'France',
  'italy': 'Italy',
  'japan': 'Japan',
  's-asia': 'South Asia',
  's-america': 'South and Central America',
  'spain-pt': 'Spain and Portugal',
  'uk-ire': 'UK and Ireland',
  'us-canada': 'USA and Canada'
}

var destinationTopics = {
  'eu-east': ['First Discussion Topic', 'Best Way to Travel from London to Moscow', 'Where in Eastern Europe do they speak Russian?'],
  'nordics': ['Where/When can I see the Northern Lights?'],
  's-e-asia': ['Places to stay in Borneo','Jakarta'],
  'china': ['Great Wall of China','Hainan','Hotels in Shanghai'],
  'africa': ['Going on Safari','Is Congo Safe?','How many malaria pills should I take?'],
  'middle-e': ['What should I wear in Saudi Arabia?'],
  'aus-nz': ['Flights to Fiji','Best places to see kangaroos'],
  'balkans': ['What\'s happening with Politics in Serbia?','Interrailing the Balkans'],
  'eu-central': ['How long should I spend in Berlin vs. Munich?'],
  'france': ['Best Castles in Normandy','Eiffel Tower at Night','Loire Valley Tours'],
  'italy': ['Naples and Pompeii','Venice Boat Tours'],
  'japan': ['Rokko Island','Honshu'],
  's-asia': ['New Delhi'],
  's-america': ['Machu Pichu','Peru','Rio'],
  'spain-pt': ['Barcelona'],
  'uk-ire': ['Dublin','Scottish Highlands','London Bus Tours'],
  'us-canada': ['Los Angeles','Washington D.C.','New York']
}
*/
