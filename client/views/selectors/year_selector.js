Template.yearSelector.helpers({
  years: function () {
    var years = [];
    var currentYear = (new Date()).getFullYear();
    for (var year = 2012; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  }
});
