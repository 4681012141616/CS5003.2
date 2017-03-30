var map, labels, markers, markerCluster, markerLocations;



// function to focus the map on a given location (city, park, etc.)
function showOnMap( location ) {

  if (location.hasOwnProperty(markerLocations)) {

    // Create an array of attraction names used to label the markers.
    labels = location.tourist_attractions;

    // add markers to the map
    markers = location.markerLocations.map(function(location, i) {
      return new google.maps.Marker({
        position: location,
        label: labels[i % labels.length]
      });
    });

    // Add a marker clusterer to manage the markers.
    markerCluster = new MarkerClusterer(map, markers,
      {imagePath:   'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

  }

  map.setZoom(11);
  map.panTo({lat: location.latitude, lng: location.longitude});

}




// function to initialise the map
function initMap() {

  map = new google.maps.Map($('#map')[0], {
    zoom: 1,
    center: {lat: 10, lng: 30},
    disableDefaultUI: true
  });

}





// example data only

var testLocation = {
  '_id': 'London',
  '_rev': 'blerahrgjhegahg',
  'city_name': 'London',
  'country_name': 'United Kingdom',
  'introduction': 'London, the capital of England and the United Kingdom, is a 21st-century ciy with history stretching back to Roman times. At its centre sta...',
  'latitude': 51.5074,
  'longitude': -0.1278,
  'topics': [
    'suggest_dinner_restaurant_for_first_night_in_london',
    'london_pass'
  ],
  'tourist_attractions': [
    'London Eye',
    'Tower Bridge',
    'Buckingham Palace'
  ],
  'markerLocations': [
    {lat: 51.5033, lng: -0.1195},
    {lat: 51.5055, lng: -0.0754},
    {lat: 51.5014, lng: -0.1419}
  ],
  'type': 'destination'
}
