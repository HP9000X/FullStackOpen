import { useState, useEffect } from 'react'
import countriesService from './services/countries'

const Search = ({ search, handleFilterInput }) => {
  return (
    <div>
      find countries {' '}
      <input 
        value={search} 
        onChange={handleFilterInput}
        id="Search Term"></input>
    </div>
  )
}

const Countries = ({ countries, setSearch, weather }) => {
  if (countries.length > 10) {
    return (
      <p>Too many matches specify another filter</p>
    )
  } else if (countries.length > 1) {
    return (
      <>
        {countries.map((country) => {
          return (
            <CountryName 
              country={country} 
              setSearch={setSearch}
              key={country.name.common}>

            </CountryName>
          )
        })}
      </>
    )
  } else if (countries.length === 1) {
    return (
      <CountryInfo country={countries[0]} weather={weather}></CountryInfo>
    )
  }
}

const CountryName = ({ country, setSearch }) => {
  return (
    <div>{country.name.common}{' '}
    <button onClick={() => {
      setSearch(country.name.common)
    }}>Show</button></div>
  )
}

const CountryInfo = ({ country, weather }) => {
  return (
    <>
      <h1>{country.name.common}</h1>
      <div>Capital {country.capital}</div>
      <div>Area {country.area}</div>
      <h1>Languages</h1>
      <ul>
        {Object.values(country.languages).map((lang, index) => (
          <li key={index}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`${country.name.common}'s flag`} />
      <Weather country={country} weather={weather}></Weather>
    </>
  )
}

const Weather = ({ country, weather }) => {
  if (weather) {
    return (
      <>
        <h1>Weather in {country.capital}</h1>
        <div>Temperature {weather.temp} Celcius</div>
        <img src={weather.icon} alt="weather-icon" />
        <div>Wind {weather.wind} m/s</div>
      </>
      )
  }
      
}

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [allCountries, setAllCountries] = useState([])
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countriesService
      .getAll()
      .then((allCountriesData) => {
        setAllCountries(allCountriesData)
      })
  }, [])

  useEffect(() => {
    const filteredCountries = allCountries.filter((country) => 
      country.name.common.toLowerCase().includes(search.toLowerCase())
    )
    setCountries(filteredCountries)
    if (filteredCountries.length === 1) {
      countriesService
        .getWeather(filteredCountries[0].capital)
        .then((returnedWeather) => {
          const newWeather = {
            temp: (returnedWeather.main.temp-273.15).toFixed(2),
            wind: returnedWeather.wind.speed,
            icon: `https://openweathermap.org/img/wn/${returnedWeather.weather[0].icon}@2x.png`
          }
          setWeather(newWeather)
        })
    }
  }, [search, allCountries])

  const handleFilterInput = (event) => {
    setSearch(event.target.value)
  }


  return (
    <div>
      <Search search={search} handleFilterInput={handleFilterInput} ></Search>
      <Countries 
        countries={countries} 
        setSearch={setSearch}
        weather={weather}></Countries>
    </div>
  )
}

export default App
