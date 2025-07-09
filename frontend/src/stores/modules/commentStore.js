import { defineStore } from 'pinia'
import { commentApi } from '@/apis/commentApi'
import { ref } from 'vue'

export const useCommentStore = defineStore('comment', () => {
  const list = ref([])

  // 新增評論
  const addComment = async (content, postId) => {
    const requestData = {
      data: {
        content,
        post: postId,
      },
    }

    const response = await commentApi.createComment(requestData)
    list.value.unshift(response)

    loadComments(postId) // 重新載入評論列表以確保最新數據
  }

  // 編輯評論
  const editComment = async (postId, commentId, commentContent) => {
    const response = await commentApi.updateComment(commentId, commentContent)
    if (response) {
      // 更新本地評論列表
      loadComments(postId)
    }
  }

  // 加載指定貼文的評論
  const loadComments = async (postId) => {
    const comments = await commentApi.loadComments(postId)
    list.value = comments
  }

  return {
    list,

    addComment,
    loadComments,
    editComment,
  }
})
