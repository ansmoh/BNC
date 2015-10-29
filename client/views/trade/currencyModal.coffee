
Template.currencyModal.onCreated ->
  TemplateVar.set @, 'state', 'view'

Template.currencyModal.helpers
  template: ->
    s.camelcase "currency-#{TemplateVar.get('state')}"
  data: ->
    currency: Currencies.findOne @currencyId

Template.currencyModal.events
  'click [data-state]': (event, tmpl) ->
    TemplateVar.set tmpl, 'state', $(event.currentTarget).data('state')

Template.currencyModal.onRendered ->

Template.currencyModal.onDestroyed ->