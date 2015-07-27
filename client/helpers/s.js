
Template.registerHelper('s', function (/* ... */) {
  var method = arguments[0];
  var args = _.toArray(arguments).slice(1);
  args.pop()
  return s[method].apply(null, args);
});

Template.registerHelper('join', function (str, arr, options) {
  return _.toArray(arr).join(str);
});