Template.companiesList.helpers({
  companies: function () {
    var params = JSON.parse(Session.get('companiesParams'));
    delete params['currentTab'];
    return Companies.find(params);
  }
});
