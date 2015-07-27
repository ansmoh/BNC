
UI.registerHelper '_', (args...) ->
  self = this
  fn = args[0]
  args.shift()
  args.pop()
  _[fn].apply self, args
