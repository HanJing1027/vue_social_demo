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

  // 更新特定貼文的狀態
  const updatePostState = (postId, updates) => {
    const postIndex = list.value.findIndex((post) => post.id === postId)
    if (postIndex !== -1) {
      list.value[postIndex] = { ...list.value[postIndex], ...updates }
    }
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
    const post = list.value.find((p) => p.id === postId)
    if (!post) return false

    // 樂觀更新
    const originalLiked = post.likedByMe
    const originalCount = post.liked_bies

    updatePostState(postId, {
      likedByMe: !originalLiked,
      liked_bies: originalCount + (originalLiked ? -1 : 1),
    })

    try {
      const isLiked = await postApi.likePost(postId)
      return isLiked
    } catch (error) {
      // 回滾狀態
      updatePostState(postId, {
        likedByMe: originalLiked,
        liked_bies: originalCount,
      })
      throw error
    }
  }

  // 貼文留言
  const increaseCommentCount = (postId) => {
    const post = list.value.find((p) => p.id === postId)
    if (!post) return false

    post.comments++

    return true
  }

  // 收藏貼文
  const toggleFavorPost = async (postId) => {
    const post = list.value.find((p) => p.id === postId)
    if (!post) return false

    // 樂觀更新
    const originalFavored = post.favoredByMe
    const originalCount = post.favored_bies

    updatePostState(postId, {
      favoredByMe: !originalFavored,
      favored_bies: originalCount + (originalFavored ? -1 : 1),
    })

    try {
      const isFavor = await postApi.favorPost(postId)
      return isFavor
    } catch (error) {
      // 回滾狀態
      updatePostState(postId, {
        favoredByMe: originalFavored,
        favored_bies: originalCount,
      })
      throw error
    }
  }

  return {
    list,
    currentPostId,

    postDetails,

    loadAllPosts,
    createPost,
    toggleLikePost,
    toggleFavorPost,
    setCurrentPostId,
    increaseCommentCount,
  }
})
