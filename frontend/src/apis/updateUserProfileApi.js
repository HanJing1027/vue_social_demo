import { useUserStore } from '@/stores/modules/userStore'
import { postFormData, put } from './request'

export const updateUserApi = {
  // 上傳 Avatar 的 API
  uploadFile: async (file) => {
    const formData = new FormData()
    formData.append('files', file)

    try {
      const response = await postFormData('/api/upload', formData)

      return response[0].url
    } catch (error) {
      throw error
    }
  },

  // 更新用戶資料的 API
  updateUserData: async (userData) => {
    const userStore = useUserStore()
    const userId = userStore.getUserId

    try {
      const response = await put(`/api/users/${userId}`, userData)
      userStore.updateUser(response)
      return response
    } catch (error) {
      throw error
    }
  },
}
