Meteor.subscribe('fellows');
Meteor.subscribe('companies');
Meteor.subscribe('cities');

Template.body.created = function() {
  Session.set('activeParamsKey', 'fellowsParams');
  Session.set('fellowsParams', JSON.stringify({}));
  Session.set('companiesParams', JSON.stringify({}));
};

function addToJSONParams(key, value) {
  var activeParamsKey = Session.get('activeParamsKey') + 'Params';
  var sessionParams = JSON.parse(Session.get(activeParamsKey));

  if (value) {
    sessionParams[key] = value;
  }
  else {
    delete sessionParams[key];
  }

  Session.set(activeParamsKey, JSON.stringify(sessionParams));
  console.log('set ' + activeParamsKey + ' to ', JSON.parse(Session.get(activeParamsKey)));
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
  //'change select[name="city"]': function(e) {
  //  var city = e.target.value;
  //  map.bubbles([{
  //    name: city,
  //    latitude: citiesToCoords[city].latitude,
  //    longitude: citiesToCoords[city].longitude,
  //    radius: 20,
  //  }]);
  //},
  'submit #search': function(e) {
    e.preventDefault();
    var query = $('#search-input').val().toLowerCase();

    addToJSONParams('allText', {$regex: query});
  },
});
