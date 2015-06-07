Meteor.subscribe('fellows');
Meteor.subscribe('companies');
Meteor.subscribe('cities');

Template.body.created = function() {
  Session.setDefault('activeParamsKey', 'fellowsParams');
  Session.setDefault('fellowsParams', '{}');
  Session.setDefault('companiesParams', '{}');
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
  'click .datamaps-bubble': function(e) {
    var activeParamsKey = Session.get('activeParamsKey');
    var activeSelectors = activeParamsKey.replace('Params', '-selectors');

    var bubbleInfo = $(e.target).data('info');
    var city = bubbleInfo.city;

    $('#' + activeSelectors).find('select[name="city"]').val(city);
    addToJSONParams('city', city);
  },
  'submit #search': function(e) {
    e.preventDefault();
    var query = $('#search-input').val().toLowerCase();

    addToJSONParams('allText', {$regex: query});
  },
});

Template.body.helpers({
  resultsTitle: function() {
    var activeParamsKey = Session.get('activeParamsKey') || 'fellowsParams';
    var params = JSON.parse(Session.get(activeParamsKey));
    var collection = (activeParamsKey == 'fellowsParams') ? Fellows : Companies;
    var resultsTitleString = 'Query = ' + collection._name.charAt(0).toUpperCase() + collection._name.slice(1) + ' ';

    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        resultsTitleString += params[key] + ' ';
      }
    }

    var count = collection.find(params).count();

    return resultsTitleString + ' ; Result Count = ' + count;
  }
});
