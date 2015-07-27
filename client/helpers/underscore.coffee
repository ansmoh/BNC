
UI.registerHelper '_', (fn, args..., hash) ->
  _[fn].apply this, args
