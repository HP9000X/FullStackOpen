import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'
const api_key = import.meta.env.VITE_SOME_KEY

const getAll = () => {
  const request = axios.get(`${baseUrl}/all`)
  return request.then(response => response.data)
}

const getSpecific = (name) => {
    const request = axios.get(`${baseUrl}/name/${name}`)
  return request.then(response => response.data)
}

const getWeather = (city) => {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`
    const request = axios.get(weatherUrl)
    return request.then(response => response.data)
}

export default { getAll, getSpecific, getWeather }