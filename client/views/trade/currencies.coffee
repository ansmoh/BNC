
Template.currencies.onCreated ->

Template.currencies.helpers
  currencies: ->
    Currencies.find {}, sort: order: 1

Template.currencies.events 'click a.panel-heading': (event, tmpl) ->
  TemplateVar.setTo '.modal-dialog.currency', 'state', 'view'
  TemplateVar.setTo '#modal', 'template', $(event.currentTarget).data('template')
  TemplateVar.setTo '#modal', 'data',
    currencyId: @_id

Template.currencies.onRendered ->
