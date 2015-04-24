Fellows = new Mongo.Collection('fellows');

Template.fellowsList.helpers({
  fellows: function () {
    var params = JSON.parse(Session.get('fellowParams'));
    return Fellows.find(params);
  }
});
