Meteor.subscribe('fellows');
Meteor.subscribe('companies');

Template.body.created = function() {
  Session.set('activeParamsKey', 'fellowParams');
  Session.set('fellowParams', JSON.stringify({}));
  Session.set('companyParams', JSON.stringify({}));

  $(document).ready(function() {
    var citiesToCoords = {
      Baltimore: {latitude: 39.17, longitude: -76.61},
      Birmingham: {latitude: 33.52, longitude: -86.81}, //
      Charlotte: {latitude: 35.22, longitude: -80.84}, //
      Cincinnati: {latitude: 39.10, longitude: -84.51},
      Cleveland: {latitude: 41.48, longitude: -81.66},
      Columbus: {latitude: 39.98, longitude: -82.98},
      Denver: {latitude: 39.73, longitude: -104.99}, //
      Detroit: {latitude: 42.33, longitude: -83.04},
      Indianapolis: {latitude: 39.79, longitude: -86.14}, //
      Nashville: {latitude: 36.16, longitude: -86.78}, //
      Pittsburgh: {latitude: 40.43, longitude: -79.97}, //
      'Las Vegas': {latitude: 36.12, longitude: -115.17}, //
      Miami: {latitude: 25.77, longitude: -80.20},
      'New Orleans': {latitude: 29.95, longitude: -90.06},
      Philadelphia: {latitude: 39.95, longitude: -75.16},
      Providence: {latitude: 41.82, longitude: -71.42},
      'San Antonio': {latitude: 29.41, longitude: -98.50},
      'St. Louis': {latitude: 38.67, longitude: -90.19},
    };
    var newCities = [
      'Birmingham',
      'Charlotte',
      'Denver',
      'Indianapolis',
      'Nashville',
      'Pittsburgh',
    ];

    var bubbleData = [];
    for (var city in citiesToCoords) {
      var radius = ($.inArray(city, newCities) > 0 || city == 'Las Vegas') ? 2 : 10;
      bubbleData.push({
        name: city,
        latitude: citiesToCoords[city].latitude,
        longitude: citiesToCoords[city].longitude,
        radius: radius,
      });
    }

    var vfaStates = [
      'AL',
      'CO',
      'FL',
      'IN',
      'LA',
      'MD',
      'MI',
      'MO',
      'NC',
      'NV',
      'OH',
      'PA',
      'RI',
      'TN',
      'TX',
    ];
    var mapData = {};
    $.each(vfaStates, function(i, state) { mapData[state] = {fillKey: 'VFA'}; });

    var map = new Datamap({
      element: document.getElementById('map'),
      scope: 'usa',
      fills: {
        VFA: 'blue',
        defaultFill: 'lightgray'
      },
      data: mapData
    });
    map.bubbles(bubbleData);
  });
};

function addToJSONParams(key, value) {
  var activeParamsKey = Session.get('activeParamsKey');
  var sessionParams = JSON.parse(Session.get(activeParamsKey));

  if (value) {
    sessionParams[key] = value;
  }
  else {
    delete sessionParams[key];
  }

  Session.set(activeParamsKey, JSON.stringify(sessionParams));
  console.log('set ' + activeParamsKey + ' to ');
  console.log(JSON.parse(Session.get(activeParamsKey)));
}

Template.body.events({
  'click .tab-title a': function(e) {
    var kind = e.target.id.split('-')[0];
    var paramsKey = kind + 'Params';
    var list = kind + 'List';

    Session.set('activeParamsKey', paramsKey);
    $('#results').find('.active').removeClass('active').toggle();
    $('#' + list).addClass('active').toggle();
  },
  'change select': function(e) {
    addToJSONParams(e.target.name, e.target.value);
  },
  'click #search-button': function(e) {
    e.preventDefault();

    //addToJSONParams('query', $('#search-input').val());
    //addToJSONParams('$text', {$search: $('#search-input').val()});
  }
});
