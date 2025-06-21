import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/apis/authApi'
import { setJwtToken, getJwtToken, removeJwtToken } from '@/utils/jwtUtils'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)

  // 判斷是否已經登入
  const isAuthenticated = computed(() => {
    restoreUserFromStorage()
    const token = getJwtToken()
    const hasUser = !!user.value
    return !!(token && hasUser)
  })

  // 保存用戶資料
  const saveUserDataToStorage = (userData) => {
    try {
      localStorage.setItem('user', JSON.stringify(userData))
      return true
    } catch (error) {
      return false
    }
  }

  // 從本地存儲恢復用戶資料
  const restoreUserFromStorage = () => {
    try {
      const savedUser = localStorage.getItem('user')
      const token = getJwtToken()

      if (savedUser && token) {
        const userData = JSON.parse(savedUser)
        user.value = userData
        return true
      } else {
        removeUserData()
        return false
      }
    } catch (error) {
      removeUserData()
      return false
    }
  }

  // 清除用戶資料
  const removeUserData = () => {
    user.value = null
    localStorage.removeItem('user')
    removeJwtToken()
  }

  // 註冊
  const registerUser = async (formData) => {
    try {
      const response = await authApi.register(formData)

      return response
    } catch (error) {
      throw error
    }
  }

  // 登入
  const loginUser = async (formData) => {
    try {
      const response = await authApi.login(formData)

      if (response.jwt && response.user) {
        // 保存 JWT Token 到 cookie
        setJwtToken(response.jwt)
        // 保存用戶資料到本地存儲
        user.value = response.user
        saveUserDataToStorage(response.user)

        return response.user
      }
    } catch (error) {
      throw error
    }
  }

  // 登出
  const logoutUser = () => {
    removeUserData()
  }

  return {
    user,

    isAuthenticated,
    saveUserDataToStorage,
    restoreUserFromStorage,
    registerUser,
    loginUser,
    logoutUser,
  }
})
