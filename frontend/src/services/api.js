import axios from 'axios'

const API_URL = 'http://localhost:3001/api'

// ne znam zasto ali radi, nisam dirala
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

apiClient.interceptors.request.use(
  (config) => {
    config.params = {
      ...config.params,
      _t: new Date().getTime()
    }

    console.log('API zahtjev:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('Greska zahtjeva:', error)
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    console.log('API odgovor:', response.status)
    return response
  },
  (error) => {
    console.error('Greska odgovora:', error.response?.data || error.message)

    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        message: 'Zahtjev je istekao - server predugo odgovara',
        type: 'timeout'
      })
    }

    if (error.response) {
      return Promise.reject({
        message: error.response.data?.error || 'Greska servera',
        status: error.response.status,
        type: 'server_error'
      })
    } else if (error.request) {
      return Promise.reject({
        message: 'Greska mreze - provjerite konekciju',
        type: 'network_error'
      })
    } else {
      return Promise.reject({
        message: error.message || 'Neocekivana greska',
        type: 'unknown_error'
      })
    }
  }
)

export default apiClient
