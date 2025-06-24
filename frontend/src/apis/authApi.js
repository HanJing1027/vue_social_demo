import { post } from './request'

export const authApi = {
  // 註冊
  register: async (data) => {
    try {
      const response = await post(
        '/api/auth/local/register',
        { email: data.email, username: data.username, password: data.password },
        false
      )
      return response
    } catch (error) {
      throw error
    }
  },

  // 登入
  login: async (data) => {
    try {
      const response = await post(
        '/api/auth/local',
        { identifier: data.email, password: data.password },
        false
      )
      return response
    } catch (error) {
      throw error
    }
  },
}
