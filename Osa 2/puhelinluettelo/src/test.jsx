const filteredCountries = allCountries.filter(
      country => country.name.common.toLowerCase()
      .includes(search.toLowerCase)
  )
  setCountries(filteredCountries)