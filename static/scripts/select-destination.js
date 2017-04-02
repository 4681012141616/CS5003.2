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




