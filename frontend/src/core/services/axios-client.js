import axios, { HttpStatusCode } from 'axios'
import { isEqual } from 'lodash'
import config from '../configs'
import {
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  removeAccessTokenFromLS,
  removeRefreshTokenFromLS,
  setAccessTokenToLS,
  setRefreshTokenToLS
} from '@/core/shared/storage/storage'

let isRefreshing = false
let refreshSubscribers = []

const addSubscriber = callback => {
  refreshSubscribers.push(callback)
}

const onRefreshed = token => {
  refreshSubscribers.forEach(callback => callback(token))
  refreshSubscribers = []
}

const axiosClient = axios.create({
  baseURL: config.baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
axiosClient.interceptors.request.use(
  config => {
    const token = getAccessTokenFromLS()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosClient.interceptors.response.use(
  response => {
    return response.data
  },
  async error => {
    const originalRequest = error.config

    if (
      error.response &&
      isEqual(error.response.status, HttpStatusCode.Unauthorized) &&
      !originalRequest._retry
    ) {
      if (!isRefreshing) {
        originalRequest._retry = true
        isRefreshing = true

        try {
          const refreshToken = getRefreshTokenFromLS()

          if (!refreshToken) {
            logout()
            return Promise.reject(error)
          }

          const response = await axios.post(`${config.baseUrl}/auth/refresh-token`, {
            refresh_token: refreshToken
          })

          if (isEqual(response.status, HttpStatusCode.Ok)) {
            const { access_token, refresh_token } = response.data

            setAccessTokenToLS(access_token)
            setRefreshTokenToLS(refresh_token)

            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access_token}`
            }

            onRefreshed(access_token)

            isRefreshing = false
            return axiosClient(originalRequest)
          }
        } catch (refreshError) {
          isRefreshing = false

          logout()
          return Promise.reject(refreshError)
        }
      } else {
        return new Promise(resolve => {
          addSubscriber(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            resolve(axiosClient(originalRequest))
          })
        })
      }
    }

    return Promise.reject(error)
  }
)

const logout = () => {
  removeAccessTokenFromLS()
  removeRefreshTokenFromLS()
}

export default axiosClient
