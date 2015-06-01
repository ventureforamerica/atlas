Template.fellowsList.helpers({
  fellows: function () {
    var params = JSON.parse(Session.get('fellowsParams'));
    delete params['currentTab'];
    return Fellows.find(params);
  }
});
