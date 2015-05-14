Template.companiesList.helpers({
  companies: function () {
    var params = JSON.parse(Session.get('companiesParams'));
    return Companies.find(params);
  }
});
