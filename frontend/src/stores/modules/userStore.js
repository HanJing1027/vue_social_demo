import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/apis/authApi'
import { setJwtToken, getJwtToken, removeJwtToken } from '@/utils/jwtUtils'

export const useUserStore = defineStore('user', () => {
  const user = ref({})
  const isInit = ref(false)

  // 將 Avatar URL 轉換為完整的 URL
  const resolveAvatarUrl = (avatar) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL
    if (!avatar || avatar.startsWith('http')) return avatar
    return `${baseURL}${avatar}`
  }

  // 初始化用戶資料，只在創建 store 時執行一次
  const initUser = () => {
    if (isInit.value) return

    try {
      const savedUser = localStorage.getItem('user')
      const token = getJwtToken()

      if (savedUser && token) {
        const userData = JSON.parse(savedUser)
        user.value = userData
      }
    } catch (error) {
      console.error('Failed to initialize user:', error)
    } finally {
      isInit.value = true
    }
  }

  initUser()

  // 判斷是否已經登入
  const isAuthenticated = computed(() => {
    const token = getJwtToken()
    const hasUser = !!user.value
    return !!(token && hasUser)
  })

  // 取得用戶 id
  const getUserId = computed(() => {
    return user.value ? user.value.id : null
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

  // 更新用戶資料
  const updateUser = (userData) => {
    const updatedUser = {
      ...userData,
      avatar: resolveAvatarUrl(userData.avatar),
    }
    user.value = updatedUser
    saveUserDataToStorage(updatedUser)
  }

  // 從本地存儲恢復用戶資料
  const restoreUserFromStorage = () => {
    try {
      const savedUser = localStorage.getItem('user')
      const token = getJwtToken()

      if (savedUser && token) {
        const userData = JSON.parse(savedUser)
        userData.avatar = resolveAvatarUrl(userData.avatar)
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
        // 設置 JWT Token
        setJwtToken(response.jwt)
        // 將 Avatar URL 轉換為完整的 URL
        const userWithFullAvatar = {
          ...response.user,
          avatar: resolveAvatarUrl(response.user.avatar),
        }
        // 更新用戶資料
        user.value = userWithFullAvatar
        saveUserDataToStorage(userWithFullAvatar)

        return userWithFullAvatar
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
    getUserId,

    updateUser,
    saveUserDataToStorage,
    restoreUserFromStorage,
    registerUser,
    loginUser,
    logoutUser,
  }
})
