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
    // console.log('完整請求配置:', requestConfig)
    // console.log('URL:', requestConfig.url)
    // console.log('Method:', requestConfig.method)
    // console.log('Params:', requestConfig.params)
    // console.log('Data (body):', requestConfig.data)
    // console.log('最終請求標頭:', requestConfig.headers)

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

serviceAxios.interceptors.response.use(
  (response) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL

    // 處理單一用戶資料的 avatar URL
    if (response.data?.avatar && !response.data.avatar.startsWith('http')) {
      response.data.avatar = `${baseURL}${response.data.avatar}`
    }

    // 處理多筆貼文的圖片 URL
    if (Array.isArray(response.data?.data)) {
      response.data.data.forEach((item) => {
        const attributes = item.attributes

        // 補完整的 user.avatar
        const avatar = attributes?.user?.data?.attributes?.avatar
        if (avatar && !avatar.startsWith('http')) {
          attributes.user.data.attributes.avatar = `${baseURL}${avatar}`
        }

        // 補完整的 image 圖片 URL（假設取第一張）
        const imageUrl = attributes?.image?.data?.[0]?.attributes?.url
        if (imageUrl && !imageUrl.startsWith('http')) {
          attributes.image.data[0].attributes.url = `${baseURL}${imageUrl}`
        }
      })
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 統一處理所有 API 請求
const request = async (options) => {
  // 移除自定義的 auth 參數，避免傳遞給 axios
  const { auth, ...axiosOptions } = options

  const response = await serviceAxios(axiosOptions)
  return response.data
}

export const get = (url, params, auth = true) => request({ method: 'GET', url, params, auth })
export const post = (url, data, auth = true) => request({ method: 'POST', url, data, auth })
export const put = (url, data, auth = true) => request({ method: 'PUT', url, data, auth })
export const del = (url, auth = true) => request({ method: 'DELETE', url, auth })

// 單獨的 FormData 處理方法
export const postFormData = async (url, formData, auth = true) => {
  const config = {
    method: 'POST',
    url,
    data: formData,
    headers: {},
    timeout: 30000,
  }

  if (auth) {
    const token = getJwtToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  const response = await axios(config)
  return response.data
}
