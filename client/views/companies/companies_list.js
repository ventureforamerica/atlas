Companies = new Mongo.Collection('companies');

Template.companiesList.helpers({
  companies: function () {
    var params = JSON.parse(Session.get('companyParams'));
    return Companies.find(params);
  }
});
