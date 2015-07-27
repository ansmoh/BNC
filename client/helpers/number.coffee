
Template.registerHelper 'number', (value = 0, format = '', options = {}) ->
  numeral(value).format(format)
