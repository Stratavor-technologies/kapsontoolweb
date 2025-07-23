import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_KEY,
  headers: {
    'Content-Type': 'application/json',
  },
})

// console.log('this is api', import.meta.env.VITE_API_KEY)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API call failed:', error)
    return Promise.reject(error)
  }
)

export default axiosInstance
