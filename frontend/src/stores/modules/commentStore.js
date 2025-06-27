import { defineStore } from 'pinia'
import { commentApi } from '@/apis/commentApi'
import { ref } from 'vue'

export const useCommentStore = defineStore('comment', () => {
  const list = ref([])

  const addComment = async (content, postId) => {
    const requestData = {
      data: {
        content,
        post: postId,
      },
    }

    try {
      const response = await commentApi.createComment(requestData)
      list.value.unshift(response)
    } catch (error) {
      throw error
    }
  }

  return {
    list,

    addComment,
  }
})
