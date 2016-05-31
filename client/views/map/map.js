Cities = new Mongo.Collection('cities');
var map;

Tracker.autorun(function() {
  var activeParamsKey = Session.get('activeParamsKey') || 'fellowsParams';
  var activeParams = JSON.parse(Session.get(activeParamsKey) || '{}');
  var citiesToCoords = {
    Baltimore: {latitude: 39.17, longitude: -76.61},
    Birmingham: {latitude: 33.52, longitude: -86.81, isNew: true},
    Charlotte: {latitude: 35.22, longitude: -80.84, isNew: true},
    Cincinnati: {latitude: 39.10, longitude: -84.51},
    Cleveland: {latitude: 41.48, longitude: -81.66},
    Columbus: {latitude: 39.98, longitude: -82.98},
    Denver: {latitude: 39.73, longitude: -104.99, isNew: true},
    Detroit: {latitude: 42.33, longitude: -83.04},
    Indianapolis: {latitude: 39.79, longitude: -86.14, isNew: true},
    Nashville: {latitude: 36.16, longitude: -86.78, isNew: true},
    Pittsburgh: {latitude: 40.43, longitude: -79.97, isNew: true},
    'Las Vegas': {latitude: 36.12, longitude: -115.17}, //
    Miami: {latitude: 25.77, longitude: -80.20},
    'New Orleans': {latitude: 29.95, longitude: -90.06},
    Philadelphia: {latitude: 39.95, longitude: -75.16},
    Providence: {latitude: 41.82, longitude: -71.42},
    'San Antonio': {latitude: 29.41, longitude: -98.50},
    'St. Louis': {latitude: 38.67, longitude: -90.19},
  };

  var cities = Cities.find().fetch();
  var bubbleData = [];
  $.each(cities, function(i, city) {
    if (! citiesToCoords[city.name]) {
      return;
    }
    var name = city.name;
    var fellowCount = 0;
    var fellowText = '';
    for (var year in city.fellowCount) {
      if (city.fellowCount.hasOwnProperty(year)) {
        var currentFellowCount = city.fellowCount[year];
        if (currentFellowCount) {
          fellowCount += currentFellowCount;
          fellowText += '<br>' + year + ': ' + String(currentFellowCount);
        }
      }
    }

    var radius = activeParamsKey === 'fellowsParams' ? fellowCount : city.companyCount;
    radius = radius ? Math.floor(radius / 2) + 1 : ((citiesToCoords[name].isNew || name == 'Las Vegas') ? 1 : 5);
    var radiusBy = radius != 0 ? activeParamsKey : 'default';

    bubbleData.push({
      city: name,
      latitude: citiesToCoords[name].latitude,
      longitude: citiesToCoords[name].longitude,
      radius: radius,
      fillKey: activeParams.hasOwnProperty('city') && activeParams.city === name ? 'selected' : 'VFA',
      companyCount: city.companyCount,
      fellowText: fellowText,
      radiusBy: radiusBy,
    });
  });

  if (map) {
    map.bubbles(bubbleData, {
      popupTemplate: function (geo, data) {
        return '' +
          '<div class="hoverinfo">' +
            '<h3>' + data.city + '<h3>' +
            '<p>Companies: ' + data.companyCount + '</p>' +
            '<p>Fellows:' + data.fellowText + '</p>' +
          '</div>';
      }
    });
  }
});

Template.map.onRendered(function() {
  map = new Datamap({
    element: $('#map')[0],
    scope: 'usa',
    fills: {
      VFA: 'rgb(39,75,114)', // vfa blue
      selected: 'rgb(202,62,62)', // vfa red
      defaultFill: 'rgb(245,245,245)', // vfa grey
    },
    geographyConfig: {
      highlightOnHover: false,
      popupTemplate: function(geography, data) {
        return '';
      },
    }
  });
});
