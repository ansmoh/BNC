
  ###
  # Countries
  ###
  if Countries.find().count() == 0
    result = HTTP.get('http://vocab.nic.in/rest.php/country/json')
    _.each result?.data?.countries, (country) ->
      Countries.insert
        _id: country.country.country_id
        name: s.humanize(country.country.country_name)

  ###
  # States
  ###
  if States.find().count() == 0
    state_index =
      'AL': 'Alabama'
      'AK': 'Alaska'
      'AS': 'American Samoa'
      'AZ': 'Arizona'
      'AR': 'Arkansas'
      'CA': 'California'
      'CO': 'Colorado'
      'CT': 'Connecticut'
      'DE': 'Delaware'
      'DC': 'District Of Columbia'
      'FM': 'Federated States Of Micronesia'
      'FL': 'Florida'
      'GA': 'Georgia'
      'GU': 'Guam'
      'HI': 'Hawaii'
      'ID': 'Idaho'
      'IL': 'Illinois'
      'IN': 'Indiana'
      'IA': 'Iowa'
      'KS': 'Kansas'
      'KY': 'Kentucky'
      'LA': 'Louisiana'
      'ME': 'Maine'
      'MH': 'Marshall Islands'
      'MD': 'Maryland'
      'MA': 'Massachusetts'
      'MI': 'Michigan'
      'MN': 'Minnesota'
      'MS': 'Mississippi'
      'MO': 'Missouri'
      'MT': 'Montana'
      'NE': 'Nebraska'
      'NV': 'Nevada'
      'NH': 'New Hampshire'
      'NJ': 'New Jersey'
      'NM': 'New Mexico'
      'NY': 'New York'
      'NC': 'North Carolina'
      'ND': 'North Dakota'
      'MP': 'Northern Mariana Islands'
      'OH': 'Ohio'
      'OK': 'Oklahoma'
      'OR': 'Oregon'
      'PW': 'Palau'
      'PA': 'Pennsylvania'
      'PR': 'Puerto Rico'
      'RI': 'Rhode Island'
      'SC': 'South Carolina'
      'SD': 'South Dakota'
      'TN': 'Tennessee'
      'TX': 'Texas'
      'UT': 'Utah'
      'VT': 'Vermont'
      'VI': 'Virgin Islands'
      'VA': 'Virginia'
      'WA': 'Washington'
      'WV': 'West Virginia'
      'WI': 'Wisconsin'
      'WY': 'Wyoming'
    _.each state_index, (value, key) ->
      States.insert
        _id: key
        name: s.humanize(value)

  ###
  # Coupons
  ###
  if Coupons.find().count() == 0
    Coupons.insert code: '12345', amount: 100, duration: 'forever'
    Coupons.insert code: 'abc', amount: 1000, duration: 'forever'