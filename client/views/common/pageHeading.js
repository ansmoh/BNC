
/**
 * title="Title Page" icon="fa-ok" breadcrumbs="Title:route,..."
 */
Template.pageHeading.helpers({

  // Route for Home link in breadcrumbs
  home: 'home',

  displayBreadcrumbs: function () {
    return this.breadcrumbs && this.breadcrumbs !== undefined;
  },

  // Breadcrumbs
  breadcrumbs: function () {
    var out = [], breadcrumbs = this.breadcrumbs;
    if (breadcrumbs !== undefined && _.isString(breadcrumbs)) {
      _.each(breadcrumbs.split(','), function (value) {
        var parties = value.split(':');
        out.push({
          title: parties[0],
          route: parties[1],
        })
      });
    }
    return out;
  },

});