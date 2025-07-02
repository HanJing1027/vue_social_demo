import { useUserStore } from '@/stores/modules/userStore'
import { postFormData, put } from './request'

export const updateUserApi = {
  // 上傳 Avatar 的 API
  uploadFile: async (file) => {
    const formData = new FormData()
    formData.append('files', file)

    const response = await postFormData('/api/upload', formData)

    return response[0].url
  },

  // 更新用戶資料的 API
  updateUserData: async (userData) => {
    const userStore = useUserStore()
    const userId = userStore.getUserId

    const response = await put(`/api/users/${userId}`, userData)
    userStore.updateUser(response)
    return response
  },
}
