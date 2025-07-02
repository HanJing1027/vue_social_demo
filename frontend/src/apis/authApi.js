import { post } from './request'

export const authApi = {
  // 註冊
  register: async (data) => {
    const response = await post(
      '/api/auth/local/register',
      { email: data.email, username: data.username, password: data.password },
      false
    )
    return response
  },

  // 登入
  login: async (data) => {
    const response = await post(
      '/api/auth/local',
      { identifier: data.email, password: data.password },
      false
    )
    return response
  },
}
