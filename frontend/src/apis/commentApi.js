import { get, post, put } from '@/apis/request'

export const commentApi = {
  // 新增評論
  createComment: async (requestData) => {
    return await post('/api/comments', requestData)
  },

  // 更新評論
  updateComment: async (commentId, commentContent) => {
    return await put(`/api/comments/${commentId}`, {
      data: {
        commentContent,
      },
    })
  },

  // 加載評論
  loadComments: async (postId) => {
    if (!postId) return []

    const response = await get(`/api/comments?populate=*&filters[post][id][$eq]=${postId}`)

    return response.data.map((comment) => {
      return {
        id: comment?.id,
        content: comment.attributes?.content,
        pubDate: comment.attributes?.publishedAt,
        user: {
          id: comment.attributes?.user?.data?.id,
          ...comment.attributes?.user?.data?.attributes,
        },
      }
    })
  },
}
