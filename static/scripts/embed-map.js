var interactiveMap;



// function to focus the map on a given location (city, park, etc.)
function showOnMap( latitude, longitude ) {

  interactiveMap.setZoom(11);
  interactiveMap.panTo({lat: latitude, lng: longitude});

}


// function to initialise the map
function initMap() {

  interactiveMap = new google.maps.Map($('#map')[0], {
    zoom: 1,
    center: new google.maps.LatLng(10, 30),
    disableDefaultUI: true
  });

}
