import { postFormData, get, put } from '@/apis/request'
import { formatPostContent } from '@/utils/postUtils'

export const postApi = {
  // 發布貼文
  createPost: async (image, description) => {
    const formData = new FormData()
    formData.append('files.image', image)
    formData.append('data', JSON.stringify({ description }))

    try {
      return await postFormData('/api/posts', formData)
    } catch (error) {
      throw error
    }
  },

  /**
   *
   * @param {string} filters 過濾條件，例如自己發布的貼文
   * @returns
   */
  // 加載貼文
  loadPosts: async (filters = '') => {
    try {
      const response = await get('/api/posts?populate=*' + (filters && `&${filters}`), {
        sort: 'createdAt:desc', // 按創建時間降序排列
      })

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

  // 加載相對應 ID 用戶的貼文
  loadPostById: async (id) => {
    return postApi.loadPosts(`filters[user][id][$eq]=${id}`)
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
