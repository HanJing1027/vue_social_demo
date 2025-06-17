import axios from 'axios'
import { getToken } from '../utils/jwtUtils'

const serviceAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

serviceAxios.interceptors.request.use(
  (requestConfig) => {
    const token = getToken()
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`
    }
    return requestConfig
  },
  (error) => {
    // 把錯誤拋出給呼叫端繼續處理
    return Promise.reject(error)
  }
)

// 統一處理所有 API 請求
export async function request(options) {
  try {
    const response = await serviceAxios(options)
    return response.data
  } catch (error) {
    throw error
  }
}

// 便捷方法
export const get = (url, params) => request({ method: 'GET', url, params })
export const post = (url, data) => request({ method: 'POST', url, data })
export const put = (url, data) => request({ method: 'PUT', url, data })
export const del = (url, params) => request({ method: 'DELETE', url, params })
