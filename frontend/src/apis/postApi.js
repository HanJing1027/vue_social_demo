import { postFormData, get, put } from '@/apis/request'
import { formatPostContent } from '@/utils/postUtils'

export const postApi = {
  // 發布貼文

  createPost: async (images, description) => {
    const formData = new FormData()

    // 使用帶順序的檔名
    images.forEach((image, index) => {
      // 在檔名前加上順序索引 確保排序
      const orderedName = `${String(index).padStart(3, '0')}_${image.name}`
      formData.append(`files.image`, image, orderedName)
    })

    formData.append('data', JSON.stringify({ description }))

    return await postFormData('/api/posts', formData)
  },

  /**
   *
   * @param {string} filters 過濾條件，例如自己發布的貼文
   * @returns
   */
  // 加載貼文
  loadPosts: async (filters = '') => {
    const response = await get('/api/posts?populate=*' + (filters && `&${filters}`), {
      sort: 'createdAt:desc', // 按創建時間降序排列
    })

    // 如果需要調試 可以取消註解以下行
    // console.log('response:', response.data)

    return response.data.map((post) => {
      const originalDescription = post?.attributes?.description

      // 使用工具函數格式化
      const { content: shortDescription, tags } = formatPostContent(originalDescription)

      let images = post?.attributes?.image?.data || []
      if (images.length > 1) {
        images = images.sort((a, b) => {
          const aName = a.attributes.name || ''
          const bName = b.attributes.name || ''
          return aName.localeCompare(bName)
        })
      }

      return {
        id: post?.id,
        ...post?.attributes,
        description: originalDescription, // 完整內容
        shortDescription, // 30字短內容
        tags, // 標籤陣列
        // image: post?.attributes?.image?.data?.[0]?.attributes?.url, // 只取出第一張圖片
        // image: post?.attributes?.image?.data, // 取出所有圖片
        image: images,
        user: {
          id: post?.attributes?.user?.data?.id,
          ...post?.attributes?.user?.data?.attributes,
        },
      }
    })
  },

  // 搜尋貼文
  searchPosts: async (keyword) => {
    return postApi.loadPosts(`filters[description][$contains]=${keyword}`)
  },

  // 加載相對應 ID 用戶的貼文
  loadPostById: async (userId) => {
    return postApi.loadPosts(`filters[user][id][$eq]=${userId}`)
  },

  // 加載相對應 ID 用戶按讚、收藏貼文
  loadPostsLikedOrFavoredByUser: async (userId, type = '') => {
    const response = await get(`/api/users/${userId}?populate[${type}]`)
    return response[type].map((post) => ({
      id: post.id,
    }))
  },

  // 按讚貼文
  likePost: async (postId) => {
    const response = await put(`/api/posts/${postId}/like`)
    return response.data
  },

  // 收藏貼文
  favorPost: async (postId) => {
    const response = await put(`/api/posts/${postId}/favor`)
    return response.data
  },
}
