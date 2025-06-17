import Cookies from 'js-cookie'
import router from '@/router'

// Token 常數
const TOKEN_KEY = 'jwt_token'
const TOKEN_EXPIRES_DAYS = 7

// 設置 JWT Token
export const setJwtToken = (token) => {
  const options = {
    expires: TOKEN_EXPIRES_DAYS,
    // secure: true, // 只在 HTTPS 下傳輸
    sameSite: 'Strict', // 防止 CSRF 攻擊
  }

  Cookies.set(TOKEN_KEY, token, options)
}

// 獲取 JWT Token
export const getJwtToken = () => {
  return Cookies.get(TOKEN_KEY)
}

// 檢查是否已登入
export const isAuthenticated = () => {
  const token = getJwtToken()
  return !!token // 如果有 token，就認定為已登入
}

// 移除 JWT Token
export const removeJwtToken = () => {
  Cookies.remove(TOKEN_KEY)
}

// 登出功能
export const logout = () => {
  removeJwtToken()
  router.push('/login') // 登出後重定向到登入頁面
}
