
Template.registerHelper 'date', (value = undefined, format = '', options = {}) ->
  moment(value).format(format)
