import axios from 'axios'
import { getAccessToken } from './axiosUtils'

const apiClient = axios.create({
  baseURL: 'https://orgac85713a.crm4.dynamics.com/api/data/v9.2/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Inject token automatically before every request
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken()
    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

export default apiClient
