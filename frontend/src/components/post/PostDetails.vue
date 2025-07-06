<template>
  <TheModal>
    <!-- 貼文內容 -->
    <div class="post-detail">
      <div class="post-layout">
        <!-- 左側圖片 -->
        <div class="post-image-section" @dblclick="handleImageClick">
          <swiper
            :slides-per-view="1"
            :space-between="10"
            :pagination="{ clickable: true }"
            :modules="[Pagination]"
            class="post-swiper"
            @swiper="onSwiper"
            :observer="true"
            :observeParents="true"
            :watchSlidesProgress="true"
          >
            <swiper-slide v-for="postImg in post.image" :key="postImg.id">
              <img :src="postImg.attributes.url" alt="貼文圖片" />
            </swiper-slide>
          </swiper>
          <i
            v-if="showHeart"
            class="bx bxs-heart liked-icon"
            :style="{
              top: `${heartPosition.y}px`,
              left: `${heartPosition.x}px`,
            }"
          ></i>
        </div>

        <!-- 右側內容 -->
        <div class="post-content-section">
          <!-- 貼文標題區域 (固定不滾動) -->
          <div class="post-header">
            <div class="user-info">
              <div class="avatar" @click="goToUserProfile(post.user?.id)">
                <TheAvatar :src="post.user?.avatar" :width="40" :height="40" :fontSize="20" />
              </div>
              <div>
                <div class="username" @click="goToUserProfile(post.user?.id)">
                  {{ post.user?.name || post.user?.username }}
                </div>
                <div class="post-time">{{ formatTimeAgo(post.createdAt) }}</div>
              </div>
            </div>
          </div>

          <!-- 可滾動的內容區域 -->
          <div class="post-scrollable-content">
            <!-- 貼文文字內容 -->
            <div class="post-content">
              <p class="post-text">
                {{ content }}
              </p>

              <!-- 標籤 -->
              <div class="post-tags">
                <span
                  v-for="(tag, index) in post.tags"
                  :key="index"
                  class="tag"
                  @click="handleTagClick(tag)"
                  >{{ tag }}</span
                >
              </div>
            </div>

            <!-- 互動按鈕 -->
            <PostActions :post="post" />

            <!-- 留言區域 -->
            <div class="comments-section">
              <h3 class="comments-title">留言</h3>

              <!-- 新增留言 -->
              <form class="comment-input" @submit.prevent="addComment">
                <textarea v-model="commentContent" type="text" placeholder="寫下你的留言..." />
                <button type="submit" class="send-btn">
                  <i class="bx bx-send"></i>
                </button>
              </form>

              <!-- 留言列表 -->
              <div v-if="comments.length > 0" class="comments-list">
                <div class="comment-item" v-for="comment in comments" :key="comment.id">
                  <div class="avatar" @click="goToUserProfile(comment.user?.id)">
                    <TheAvatar
                      :src="comment.user?.avatar"
                      :width="40"
                      :height="40"
                      :fontSize="20"
                    />
                  </div>
                  <div class="comment-content">
                    <div class="comment-header">
                      <span class="comment-username" @click="goToUserProfile(comment.user?.id)">{{
                        comment.user?.name || comment.user?.username
                      }}</span>
                      <span v-if="comment.user?.id === post.user?.id" class="original-poster-tag"
                        >原po</span
                      >
                      <span class="comment-time">{{ formatTimeAgo(comment.pubDate) }}</span>
                    </div>
                    <p class="comment-text">{{ comment.content }}</p>
                  </div>
                </div>
              </div>
              <!-- 如果沒有留言，顯示提示 -->
              <div v-else class="no-comments">
                <p>還沒有留言，快來搶沙發！</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TheModal>
</template>

<script setup>
import TheModal from '@/components/common/TheModal.vue'
import TheAvatar from '@/components/common/TheAvatar.vue'
import PostActions from '@/components/post/PostActions.vue'

import { ref, computed, onMounted, nextTick } from 'vue'
import { usePostStore } from '@/stores/modules/postStore'
import { useCommentStore } from '@/stores/modules/commentStore'
import { useToastStore } from '@/stores/modules/toastStore'
import { useModalStore } from '@/stores/modules/modalStore'
import { formatTimeAgo } from '@/utils/postUtils'
import { useRouter } from 'vue-router'
import { debounce } from '@/utils/debounce'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const postStore = usePostStore()
const commentStore = useCommentStore()
const toastStore = useToastStore()
const modalStore = useModalStore()
const router = useRouter()
const commentContent = ref('')

const showHeart = ref(false) // 用於控制愛心圖標顯示
const heartPosition = ref({ x: 0, y: 0 }) // 用於記錄點擊位置

const post = computed(() => postStore.postDetails || {})
const comments = computed(() => commentStore.list)

const description = post.value.description || ''
const content = description.replace(/#[\u4e00-\u9fa5\w]+/g, '').trim()

const goToUserProfile = (userId) => {
  if (!post.value?.user || !post.value?.user?.id) {
    toastStore.showError('用戶資訊不完整，無法跳轉到個人主頁')
    return
  }

  router.push(`/profile/${userId}`)

  modalStore.closeAllModals() // 關閉所有彈跳視窗
}

// 點擊標籤事件處理
const handleTagClick = (tag) => {
  // 消除 # 前綴
  const keyword = tag.startsWith('#') ? tag.slice(1) : tag
  if (keyword) {
    router.push({ name: 'search_result', query: { keyword } })
  }

  modalStore.closeAllModals() // 關閉所有彈跳視窗
}

// 處理點擊圖片按讚事件
const handleImageClick = async (event) => {
  if (post.value.likedByMe) return

  try {
    // 記錄滑鼠點擊的位置
    const rect = event.currentTarget.getBoundingClientRect()
    heartPosition.value = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }

    await postStore.toggleLikePost(post.value.id)
    showHeart.value = true

    // 1秒後隱藏愛心圖標
    setTimeout(() => {
      showHeart.value = false
    }, 1000)
  } catch (error) {
    toastStore.showError('按讚失敗，請稍後再試')
  }
}

// 新增留言
const originalAddComment = async () => {
  if (!commentContent.value.trim()) {
    toastStore.showError('留言內容不能為空')
    return
  }

  try {
    await commentStore.addComment(commentContent.value.trim(), post.value.id)

    postStore.increaseCommentCount(post.value.id) // 更新貼文的留言數量

    toastStore.showSuccess('留言新增成功')
  } catch (error) {
    toastStore.showError('新增留言失敗，請稍後再試')
  } finally {
    commentContent.value = '' // 清空留言輸入框
  }
}

const addComment = debounce(originalAddComment, 300)

const swiperInstance = ref(null)

// 處理 Swiper 實例
const onSwiper = (swiper) => {
  swiperInstance.value = swiper
  // 確保 Swiper 正確初始化
  nextTick(() => {
    swiper.update()
  })
}

onMounted(() => {
  commentStore.loadComments(postStore.currentPostId)

  // 確保 Swiper 在組件掛載後正確更新
  nextTick(() => {
    if (swiperInstance.value) {
      swiperInstance.value.update()
    }
  })
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;
@use '@/assets/styles/_mixins.scss' as *;

.post-detail {
  height: 100%;
  min-height: 0;

  .post-layout {
    display: flex;
    height: 100%;
    min-height: 0;
  }

  .post-image-section {
    flex: 1.5;
    background: $surface-alt;
    user-select: none;
    position: relative;
    overflow: hidden;

    .post-swiper {
      width: 100%;
      height: 100%;

      /* 確保 Swiper 容器不會溢出 */
      .swiper-wrapper {
        width: 100%;
        height: 100%;
      }

      /* 分頁點點樣式 */
      :deep(.swiper-pagination-bullet) {
        background: #ffffffb3;
        opacity: 0.7;
        width: 8px;
        height: 8px;
      }

      :deep(.swiper-pagination-bullet-active) {
        background: $primary-color;
        opacity: 1;
      }

      /* 調整分頁點點位置 */
      :deep(.swiper-pagination) {
        bottom: 10px;
      }

      :deep(.swiper-slide) {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        flex-shrink: 0;
      }
    }

    img {
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      object-fit: contain;
      object-position: center;
      display: block;
    }

    .liked-icon {
      position: absolute;
      transform: translate(-50%, -50%) scale(1);
      font-size: 68px;
      color: $danger-color;
      opacity: 0.7;
      z-index: 999;
      animation: heartPop 0.6s ease-out;
    }

    @keyframes heartPop {
      0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
      }
      50% {
        transform: translate(-50%, -50%) scale(1.5);
        opacity: 0.7;
      }
      100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.7;
      }
    }
  }

  .post-content-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }

  .post-header {
    padding: 20px;
    border-bottom: 1px solid $border-light;
    flex-shrink: 0;
  }

  .post-scrollable-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;

    /* 添加滾動條樣式 */
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: $border-light;
      border-radius: 4px;

      &:hover {
        background: $text-secondary;
      }
    }

    scrollbar-width: thin;
    scrollbar-color: $border-light transparent;
  }

  .post-content {
    padding: 20px;
    border-bottom: 1px solid $border-light;
    flex-shrink: 0;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .avatar {
      cursor: pointer;
    }
  }

  .username {
    cursor: pointer;
    font-weight: 600;
    color: $text-color;
    font-size: 16px;
    margin-bottom: 5px;
  }

  .post-time {
    color: $text-secondary;
    font-size: 14px;
  }

  .post-text {
    color: $text-color;
    line-height: 1.6;
    font-size: 16px;
    margin: 0 0 16px 0;
    white-space: pre-line;
  }

  .post-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .tag {
    background-color: rgba(var(--primary-color-rgb), 0.1);
    color: $primary-color;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color $transition-speed ease;

    &:hover {
      background-color: rgba(var(--primary-color-rgb), 0.2);
    }
  }
}

.comments-section {
  padding: 20px;
  flex: 1;
  // display: flex;
  flex-direction: column;
  min-height: 0;

  .comments-title {
    font-size: 18px;
    font-weight: 600;
    color: $text-color;
    margin-bottom: 16px;
    flex-shrink: 0;
  }

  .comment-input {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    border-radius: 12px;
    flex-shrink: 0;

    textarea {
      @include base-input($borderRadius: 20px);
      min-height: 40px;
      max-height: 120px;
      height: 40px;
      resize: none;
      padding: 12px 16px;
      line-height: 1.4;
      font-size: 14px;
      overflow-y: auto;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }

      &:focus {
        height: auto;
        min-height: 60px;
      }
    }

    .send-btn {
      width: 28px;
      height: 28px;
      border: none;
      background: $primary-color;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all $transition-speed ease;

      &:hover {
        transform: scale(1.1);
      }

      i {
        font-size: 14px;
        color: white;
      }
    }
  }

  .comments-list {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }

  .comment-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 20px;

    .avatar {
      cursor: pointer;
    }
  }

  .comment-content {
    flex: 1;
    background: #f8f9fa;
    padding: 8px 12px;
    border-radius: 12px 12px 12px 3px;
    position: relative;
    max-width: 85%;

    &::before {
      content: '';
      position: absolute;
      left: -5px;
      top: 8px;
      width: 0;
      height: 0;
      border: 5px solid transparent;
      border-right-color: #f8f9fa;
    }
  }

  .comment-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 2px;
  }

  .comment-username {
    cursor: pointer;
    font-weight: 600;
    color: $primary-color;
    font-size: 13px;
  }

  .original-poster-tag {
    cursor: default;
    background-color: $primary-color;
    color: $background;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 8px;
  }

  .comment-time {
    color: $text-secondary;
    font-size: 11px;
  }

  .comment-text {
    color: $text-color;
    font-size: 13px;
    line-height: 1.4;
    margin: 0;
    white-space: pre-line;
  }
}

.no-comments {
  text-align: center;
  padding: 40px 20px;
  color: $text-secondary;

  p {
    margin: 0;
    font-size: 14px;
  }
}

/* 手機版樣式 */
@media (max-width: $mobile-breakpoint) {
  .post-detail {
    .post-layout {
      flex-direction: column;
      height: 100%;
      min-height: 0;
    }

    .post-image-section {
      flex: none;
      height: 35vh;
      background: $surface-alt;

      .post-swiper {
        :deep(.swiper-pagination) {
          bottom: 5px;
        }
      }

      img {
        object-fit: contain;
      }
    }

    .post-content-section {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    .post-scrollable-content {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: $border-light;
        border-radius: 3px;

        &:hover {
          background: $text-secondary;
        }
      }
    }

    .post-header {
      padding: 12px 16px;
    }

    .post-content {
      padding: 12px 16px;
    }

    .user-info {
      gap: 8px;
    }

    .username {
      font-size: 14px;
      margin-bottom: 2px;
    }

    .post-time {
      font-size: 12px;
    }

    .post-text {
      font-size: 14px;
      line-height: 1.4;
      margin: 0 0 8px 0;
    }

    .post-tags {
      gap: 6px;
    }

    .tag {
      padding: 3px 8px;
      font-size: 12px;
    }
  }

  .comments-section {
    padding: 12px 16px;
    flex: 1;
    min-height: 0;

    .comments-title {
      font-size: 16px;
      margin-bottom: 10px;
    }

    .comment-input {
      margin-bottom: 12px;

      textarea {
        font-size: 14px;
        padding: 8px 16px;
      }

      .send-btn {
        width: 24px;
        height: 24px;

        i {
          font-size: 11px;
        }
      }
    }

    .comments-list {
      gap: 8px;
    }

    .comment-item {
      margin-bottom: 10px;
    }

    .comment-content {
      border-radius: 10px 10px 10px 2px;

      &::before {
        left: -4px;
        top: 6px;
        border-width: 4px;
        border-right-color: #f8f9fa;
      }
    }

    .comment-header {
      gap: 4px;
      margin-bottom: 1px;
    }

    .comment-username {
      font-size: 12px;
    }

    .comment-time {
      font-size: 10px;
    }

    .comment-text {
      font-size: 12px;
      line-height: 1.3;
    }
  }
}

@media (hover: none) {
  .tag:hover {
    background-color: rgba(var(--primary-color-rgb), 0.1);
  }

  .comment-input .send-btn:hover {
    transform: none;
  }
}
</style>
