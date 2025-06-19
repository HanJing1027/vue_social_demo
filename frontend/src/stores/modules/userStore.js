import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/apis/authApi'
import { setJwtToken, removeJwtToken } from '@/utils/jwtUtils'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const error = ref(null)

  // 註冊
  const registerUser = async (userData) => {
    error.value = null

    try {
      const response = await authApi.register(userData)

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

  const loginUser = async (userData) => {
    //
  }

  return {
    user,
    error,

    registerUser,
  }
})
