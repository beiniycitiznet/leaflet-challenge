// Store API query variables
earthquakesUrl='https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Grab the data with d3
d3.json(earthquakesUrl, function(earthquakesData) {

  // Define a map object
  var myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom: 5
  });

  // light Layer
  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  }).addTo(myMap);

  // Function to determine marker color based on magnitude
  function getColor(mag) {
    return mag < 1 ? 'rgb(233, 30, 99)' :
          mag < 2  ? 'rgb(156, 39, 176)' :
          mag < 3  ? 'rgb(103, 58, 183)' :
          mag < 4  ? 'rgb(63, 81, 181 )' :
          mag < 5  ? 'rgb(33, 150, 243)' :
          mag < 6  ? 'rgb(0, 188, 212)' :
          mag < 7  ? 'rgb(0, 150, 136)' :
          mag < 8  ? 'rgb(76, 175, 80)' :
          mag < 9  ? 'rgb(205, 220, 57)' :
                      'rgb(255, 235, 59)';
  };

  // Function to determine marker size based on magnitude
  function markerSize(mag) {
      mag=parseFloat(mag);
      return mag *15000;
  };
    
  // Function to have two digits in an integer
  function twoDigits(n){
    return n > 9 ? "" + n: "0" + n;
  };

  // Function to convert from timestamp to dates
  function timeConverter(timestamp){
    var a = new Date(timestamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = twoDigits(a.getHours());
    var min = twoDigits(a.getMinutes());
    var sec = twoDigits(a.getSeconds());
    var time = month + ' ' + date + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  };

  // Set features
  var features=earthquakesData.features;

  // Find the max magnitude
  var maxMag=0;
  for (var i = 0; i < features.length; i++){
    var mags=parseFloat(features[i].properties.mag);
    if (mags>maxMag){
      maxMag=mags;
    }
  }
  console.log(maxMag);

  // Loop through all features and draw circles
  for (var i = 0; i < features.length; i++){
    var coordinates=[features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]];
    var dates=timeConverter(features[i].properties.time);
    var mags=parseFloat(features[i].properties.mag);

    // Setting the marker radius for the state by passing magnitude into the markerSize function
    L.circle(coordinates, {
      stroke: false,
      fillOpacity: 0.5,
      // color: "green",
      fillColor: getColor(mags),
      radius: markerSize(mags)
    }).bindPopup("<h2>" + features[i].properties.place + "</h2> <hr> <h3>Time: " + dates + "</h3> <h3>Magnitude: " + mags + "</h3>").addTo(myMap)
  };

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [0,1,2,3,4,5,6,7,8,9];
    var colors = ['rgb(233, 30, 99)', 'rgb(156, 39, 176)', 'rgb(103, 58, 183)', 'rgb(63, 81, 181)', 'rgb(33, 150, 243)', 'rgb(0, 188, 212)', 'rgb(0, 150, 136)', 'rgb(76, 175, 80)', 'rgb(205, 220, 57)', 'rgb(255, 235, 59)'];
    var labels = [];

    // Add range of each rank and color
    var legendInfo = "<h1>Magnitude</h1>"

    div.innerHTML = legendInfo;

    limits.forEach(function(index) {
      labels.push("<div style=\"background-color: " + colors[index] + "; text-align: center\" >" + index + "-" + (index+1) + "</div>");
    });

    div.innerHTML += "<div>" + labels.join("") + "</div>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
});



