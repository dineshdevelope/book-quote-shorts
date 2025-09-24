import axios from 'axios'
import toast from 'react-hot-toast'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
})

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    const message = error.response?.data?.message || 'Something went wrong'
    if (error.response?.status !== 404) {
      toast.error(message)
    }
    
    return Promise.reject(error)
  }
)

export const quoteAPI = {
  getAll: (params) => API.get('/api/quotes', { params }),
  getById: (id) => API.get(`/api/quotes/${id}`),
  create: (data) => API.post('/api/quotes', data),
  update: (id, data) => API.put(`/api/quotes/${id}`, data),
  delete: (id) => API.delete(`/api/quotes/${id}`),
  like: (id) => API.post(`/api/quotes/${id}/like`),
}

export const authAPI = {
  login: (credentials) => API.post('/api/auth/login', credentials),
  register: (userData) => API.post('/api/auth/register', userData),
  getMe: () => API.get('/api/auth/me'),
}

export default API