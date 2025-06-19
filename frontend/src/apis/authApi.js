import { post } from './request'

export const authApi = {
  // 註冊
  register: async (data) => {
    try {
      const response = await post('/api/auth/local/register', data, false)
      return response
    } catch (error) {
      throw error
    }
  },
  //
}
