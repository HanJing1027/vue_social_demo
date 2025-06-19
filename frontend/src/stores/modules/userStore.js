import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '@/apis/authApi'
import { setJwtToken, removeJwtToken } from '@/utils/jwtUtils'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)

  // 註冊
  const registerUser = async (userData) => {
    try {
      const response = await authApi.register(userData)

      return response
    } catch (error) {
      throw error
    }
  }

  // 登入
  const loginUser = async (userData) => {
    try {
      const response = await authApi.login(userData)

      if (response.jwt) {
        setJwtToken(response.jwt)
        user.value = response.user
        localStorage.setItem('user', JSON.stringify(user.value))
      }

      return response.user
    } catch (error) {
      throw error
    }
  }

  return {
    user,

    registerUser,
    loginUser,
  }
})
