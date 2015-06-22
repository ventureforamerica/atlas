Fellows = new Mongo.Collection('fellows');
Template.fellowsList.helpers({
  fellows: function () {
    var params = JSON.parse(Session.get('fellowsParams') || '{}');
    return Fellows.find(params);
  }
});
