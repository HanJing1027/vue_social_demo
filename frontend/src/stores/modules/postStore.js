import { defineStore } from 'pinia'
import { postApi } from '@/apis/postApi'
import { ref } from 'vue'

export const usePostStore = defineStore('post', () => {
  const list = ref([]) // 貼文列表

  // 創建新貼文
  const createPost = async (image, description) => {
    try {
      const newPost = await postApi.createPost(image, description)
      list.value.unshift(newPost)

      return newPost
    } catch (error) {
      throw error
    }
  }

  // 載入所有貼文
  const loadAllPosts = async () => {
    try {
      const data = await postApi.loadPosts()
      list.value = data

      return data
    } catch (error) {
      throw error
    }
  }

  // 按讚貼文
  const toggleLikePost = async (postId) => {
    try {
      const isLiked = await postApi.likePost(postId)
      return isLiked
    } catch (error) {
      throw error
    }
  }

  return {
    list,

    loadAllPosts,
    createPost,
    toggleLikePost,
  }
})
