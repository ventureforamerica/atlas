Meteor.subscribe('fellows');
Meteor.subscribe('companies');
Meteor.subscribe('cities');

Template.body.created = function() {
  Session.set('activeParamsKey', 'fellowsParams');
  Session.set('highlightedCity', '');
  Session.set('fellowsParams', JSON.stringify({currentTab: 'Fellows'}));
  Session.set('companiesParams', JSON.stringify({currentTab: 'Companies'}));
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
  'submit #search': function(e) {
    e.preventDefault();
    var query = $('#search-input').val().toLowerCase();

    addToJSONParams('allText', {$regex: query});
  },
});

Template.body.helpers({
  resultsTitle: function() {
    var params = JSON.parse(Session.get(Session.get('activeParamsKey')));
    var resultsTitleString = 'Query = ';

    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        resultsTitleString += params[key] + ' ';
      }
    }

    var collection = (params['currentTab'] == 'Fellows') ? Fellows : Companies;
    delete params['currentTab'];
    var count = collection.find(params).count();

    return resultsTitleString + ' ; Result Count = ' + count;
  }
});
