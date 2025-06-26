import { defineStore } from 'pinia'
import { postApi } from '@/apis/postApi'
import { ref, computed } from 'vue'

export const usePostStore = defineStore('post', () => {
  const list = ref([]) // 貼文列表
  const currentPostId = ref(null) // 當前貼文 ID

  // 計算屬性：獲取當前貼文詳情
  const postDetails = computed(() => {
    if (!currentPostId.value) return null

    // 根據 currentPostId 獲取當前貼文詳情
    return list.value.find((post) => post.id === currentPostId.value)
  })

  // 設置當前貼文 ID
  const setCurrentPostId = (postId) => {
    currentPostId.value = postId
  }

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

  // 收藏貼文
  const toggleFavorPost = async (postId) => {
    try {
      const isFavor = await postApi.favorPost(postId)
      return isFavor
    } catch (error) {
      throw error
    }
  }

  return {
    list,
    // currentPostId,

    postDetails,

    loadAllPosts,
    createPost,
    toggleLikePost,
    toggleFavorPost,
    setCurrentPostId,
  }
})
