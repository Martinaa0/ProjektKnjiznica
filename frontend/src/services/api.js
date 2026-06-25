import axios from 'axios'

// ne znam zasto ali radi, nisam dirala
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000
})

export default apiClient
