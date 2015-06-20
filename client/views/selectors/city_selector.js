Template.citySelector.helpers({
  cities: function () {
    return Cities.find({}, {sort: {name: 1}});
  },
  count: function() {
    var count = 0;
    if (Session.get('activeParamsKey') === 'fellowsParams') {
      for (var year in this.fellowCount) {
	count += this.fellowCount[year];
      }
    }
    else {
      count = this.companyCount;
    }
    return count;
  },
});
