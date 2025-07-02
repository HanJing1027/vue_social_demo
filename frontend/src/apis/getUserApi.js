import { get } from './request'

export const getUserApi = {
  getUserById: async (userId) => {
    const response = await get(`/api/users/${userId}`)
    // 移除敏感資料
    const { mobilePhone, email, ...safeData } = response
    return safeData
  },
}
