import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:41664',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.error || error.response?.data?.title || error.message || 'Sorğu zamanı xəta baş verdi.'
    return Promise.reject(new Error(message))
  },
)

export default api
