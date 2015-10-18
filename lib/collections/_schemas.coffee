
@Schemas = {}

###
# Behavior Timestampable
###
Schemas.Timestampable = new SimpleSchema
  createdAt:
    type: Date
    autoValue: ->
      if @isInsert
        new Date
      else if @isUpsert
        $setOnInsert: new Date
      else
        @unset()
  updatedAt:
    type: Date
    denyInsert: true
    optional: true
    autoValue: ->
      if @isUpdate then new Date

###
# Behavior Sluggable
###
Schemas.Sluggable = new SimpleSchema
  slug:
    type: String
    optional: true
    autoValue: ->
      title = @field 'title'
      name = @field 'name'
      if title.isSet
        s.slugify title.value
      else if name.isSet
        s.slugify name.value
      else
        @unset()

###
# Behavior Ownerable
###
Schemas.Owner = new SimpleSchema
  owner:
    type: String
    regEx: SimpleSchema.RegEx.Id
    autoValue: ->
      if @isInsert and @userId then @userId else @unset()

###
# Address
###
Schemas.Address = new SimpleSchema
  line:
    type: String
    optional: true
  city:
    type: String
  state:
    type: String
    autoform:
      options: ->
        States.find({}, sort: name: 1).map (state) ->
          label: state.name, value: state._id
  county:
    type: String
    optional: true
  zip:
    type: String
  country:
    type: String
    autoform:
      options: ->
        Countries.find({}, sort: name: 1).map (country) ->
          label: country.name, value: country._id
  fax:
    type: String
    optional: true
  phone:
    type: String
    optional: true