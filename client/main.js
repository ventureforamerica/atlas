Meteor.subscribe('fellows');
Meteor.subscribe('companies');
Meteor.subscribe('cities');

Template.body.created = function() {
  Session.setDefault('activeParamsKey', 'fellowsParams');
  Session.setDefault('fellowsParams', '{}');
  Session.setDefault('companiesParams', '{}');
};

function addToJSONParams(key, value) {
  if (key === "domain") {
    return;
  }

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

function toggleSelected($element) {
  $element.siblings('.selected').removeClass('selected');
  $element.addClass('selected');
}

Template.body.events({
  'click #domain li': function(e) {
    var kind = $(e.target).text();
    var paramsKey = kind + 'Params';

    Session.set('activeParamsKey', paramsKey);
  },
  'click .selector .content li': function(e) {
    var $this = $(e.currentTarget);
    var key = $this.parents('.content').attr('id');
    var value = $this.data(key.toLowerCase());

    toggleSelected($this);
    addToJSONParams(key, value);
  },
  'click .datamaps-bubble': function(e) {
    var activeParamsKey = Session.get('activeParamsKey');
    var activeSelectors = activeParamsKey.replace('Params', '-selectors');

    var bubbleInfo = $(e.target).data('info');
    var city = bubbleInfo.city;

    toggleSelected($('#' + activeSelectors).find('#city li[data-city="' + city + '"]'));
    addToJSONParams('city', city);
  },
  'submit #search': function(e) {
    e.preventDefault();
    var query = $('#search-input').val().toLowerCase();

    var value = query ? {$regex: query} : '';
    addToJSONParams('allText', value);
  },
});

Template.body.helpers({
  onFellowsTab: function() {
    return Session.get('activeParamsKey') === 'fellowsParams';
  },
  resultsTitle: function() {
    var activeParamsKey = Session.get('activeParamsKey') || 'fellowsParams';
    var params = JSON.parse(Session.get(activeParamsKey));
    var collection = (activeParamsKey == 'fellowsParams') ? Fellows : Companies;
    var resultsTitleString = 'Query = ' + collection._name.charAt(0).toUpperCase() + collection._name.slice(1) + ' ';

    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        if (key === 'allText') {
          resultsTitleString += params.allText.$regex;
	}
	else {
          resultsTitleString += params[key] + ' ';
	}
      }
    }

    var count = collection.find(params).count();

    return resultsTitleString + ' ; Result Count = ' + count;
  }
});
