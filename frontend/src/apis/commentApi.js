import { post } from '@/apis/request'

export const commentApi = {
  createComment: async (requestData) => {
    try {
      const response = await post('/api/comments', requestData)
      return response
    } catch (error) {
      throw error
    }
  },
}
