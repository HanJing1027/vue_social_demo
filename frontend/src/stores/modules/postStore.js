import { defineStore } from 'pinia'
import { postApi } from '@/apis/postApi'
import { ref, computed } from 'vue'

export const usePostStore = defineStore('post', () => {
  const list = ref([]) // 首頁貼文列表
  const searchResult = ref([]) // 搜尋貼文列表
  const currentPostId = ref(null) // 當前貼文 ID
  const userPostList = ref([]) // 用戶發佈的所有貼文
  const likedPostList = ref([]) // 按讚的貼文
  const favoredPostList = ref([]) // 收藏的貼文

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
  const createPost = async (image, description, userId = '') => {
    const newPost = await postApi.createPost(image, description)

    // 發佈成功後，重新加載用戶的貼文
    if (userId) {
      await loadPostsByUser(userId)
    }

    await loadAllPosts() // 重新載入所有貼文以確保最新數據

    return newPost
  }

  // 載入所有貼文
  const loadAllPosts = async () => {
    const data = await postApi.loadPosts()
    list.value = data

    return data
  }

  // 載入搜尋貼文
  const searchPostsResult = async (keyword) => {
    try {
      const response = await postApi.searchPosts(keyword)
      searchResult.value = response
    } catch (error) {
      searchResult.value = [] // 清空搜尋結果以防止錯誤狀態
    }
  }

  // 載入相對應 ID 用戶的貼文
  const loadPostsByUser = async (userId) => {
    try {
      const response = await postApi.loadPostById(userId)
      userPostList.value = response
    } catch (error) {
      userPostList.value = [] // 清空列表以防止錯誤狀態
    }
  }

  // 載入相對應 ID 用戶按讚、收藏貼文
  const loadPostsLikedOrFavoredByUser = async (userId, type = '') => {
    try {
      const response = await postApi.loadPostsLikedOrFavoredByUser(userId, type)

      // 從 list 中篩選對應的貼文
      const filteredPosts = list.value.filter((post) =>
        response.some((resPost) => resPost.id === post.id)
      )

      if (type === 'likes') {
        likedPostList.value = filteredPosts // 更新讚過的貼文列表
      } else if (type === 'favors') {
        favoredPostList.value = filteredPosts // 更新收藏的貼文列表
      }
    } catch (error) {
      // 清空對應的列表
      if (type === 'likes') {
        likedPostList.value = []
      } else if (type === 'favors') {
        favoredPostList.value = []
      }
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
    }
  }

  return {
    list,
    searchResult,
    currentPostId,
    userPostList,
    likedPostList,
    favoredPostList,

    postDetails,

    createPost,
    loadAllPosts,
    searchPostsResult,
    loadPostsByUser,
    loadPostsLikedOrFavoredByUser,
    toggleLikePost,
    toggleFavorPost,
    setCurrentPostId,
    increaseCommentCount,
  }
})
