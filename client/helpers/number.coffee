
Template.registerHelper 'number', (value = '', format = '', options = {}) ->
  numeral(value).format(format)
