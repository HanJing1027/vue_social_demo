import { defineStore } from 'pinia'
import { postApi } from '@/apis/postApi'
import { ref } from 'vue'

export const usePostStore = defineStore('post', () => {
  const list = ref([]) // 貼文列表

  const loadPosts = async (filters = {}) => {
    try {
      const data = await postApi.loadPosts(filters)
      list.value = data

      return data
    } catch (error) {
      throw error
    }
  }

  const createPost = async (image, description) => {
    try {
      const newPost = await postApi.createPost(image, description)
      list.value.unshift(newPost)

      return newPost
    } catch (error) {
      throw error
    }
  }

  return {
    list,

    loadPosts,
    createPost,
  }
})
