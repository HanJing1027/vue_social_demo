import { postFormData, get, put } from '@/apis/request'
import { formatPostContent } from '@/utils/postUtils'

export const postApi = {
  // 發布貼文
  createPost: async (image, description) => {
    const formData = new FormData()
    formData.append('files.image', image)
    formData.append('data', JSON.stringify({ description }))

    try {
      const response = await postFormData('/api/posts', formData)
      return response
    } catch (error) {
      throw error
    }
  },

  /**
   *
   * @param {string} filters 过滤条件，例如自己发布的
   * @returns
   */
  // 加載貼文
  loadPosts: async (filters = '') => {
    try {
      const response = await get('/api/posts', { populate: '*', ...filters })

      // 如果需要調試 可以取消註解以下行
      // console.log('response:', response.data)

      return response.data.map((post) => {
        const originalDescription = post?.attributes?.description

        // 使用工具函數格式化
        const { content: shortDescription, tags } = formatPostContent(originalDescription)

        return {
          id: post?.id,
          ...post?.attributes,
          description: originalDescription, // 完整內容
          shortDescription, // 30字短內容
          tags, // 標籤陣列
          image: post?.attributes?.image?.data?.[0]?.attributes?.url,
          user: {
            id: post?.attributes?.user?.data?.id,
            ...post?.attributes?.user?.data?.attributes,
          },
        }
      })
    } catch (error) {
      throw error
    }
  },

  // 按讚貼文
  likePost: async (postId) => {
    try {
      const response = await put(`/api/posts/${postId}/like`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 收藏貼文
  favorPost: async (postId) => {
    try {
      const response = await put(`/api/posts/${postId}/favor`)
      return response.data
    } catch (error) {
      throw error
    }
  },
}
