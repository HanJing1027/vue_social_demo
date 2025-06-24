import { postFormData, get } from '@/apis/request'

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

  // 加載貼文
  loadPosts: async (filters = '') => {
    try {
      const response = await get('/api/posts', { populate: '*', ...filters })

      console.log('response:', response.data)

      return response.data.map((post) => ({
        id: post?.id,
        ...post?.attributes,
        image: post?.attributes?.image?.data?.[0]?.attributes?.url,
        user: {
          id: post?.attributes?.user?.data?.id,
          ...post?.attributes?.user?.data?.attributes,
        },
      }))
    } catch (error) {
      throw error
    }
  },
}
