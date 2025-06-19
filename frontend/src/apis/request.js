import axios from 'axios'
import { getJwtToken } from '@/utils/jwtUtils'

const serviceAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

serviceAxios.interceptors.request.use(
  (requestConfig) => {
    // 如果 auth 為 false 則不需要攜帶 token (預設為 true)
    const needAuth = requestConfig.auth !== false

    if (needAuth) {
      const token = getJwtToken()
      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`
      }
    }

    return requestConfig
  },
  (error) => {
    // 把錯誤拋出給呼叫端繼續處理
    return Promise.reject(error)
  }
)

// 統一處理所有 API 請求
const request = async (options) => {
  try {
    const response = await serviceAxios(options)
    return response.data
  } catch (error) {
    throw error
  }
}
export const get = (url, params, auth = true) => request({ method: 'GET', url, params, auth })
export const post = (url, data, auth = true) => request({ method: 'POST', url, data, auth })
export const put = (url, data, auth = true) => request({ method: 'PUT', url, data, auth })
export const del = (url, auth = true) => request({ method: 'DELETE', url, auth })
