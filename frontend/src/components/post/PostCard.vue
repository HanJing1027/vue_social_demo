<template>
  <div class="post-item">
    <!-- 用戶資訊區 -->
    <div class="post-header">
      <div class="user-info" @click="goToUserProfile">
        <TheAvatar :src="post.user?.avatar" :width="40" :height="40" :fontSize="20" />
        <span class="username">{{ post.user?.name || post.user?.username }}</span>
      </div>
      <span class="post-time">{{ formatTimeAgo(post.createdAt) }}</span>
    </div>

    <!-- 貼文圖片 -->
    <div class="post-image" @dblclick="handleImageClick">
      <img :src="post.image" alt="貼文圖片" />
      <i
        v-if="showHeart"
        class="bx bxs-heart liked-icon"
        :style="{
          top: `${heartPosition.y}px`,
          left: `${heartPosition.x}px`,
        }"
      ></i>
    </div>

    <!-- 互動按鈕區 -->
    <PostActions :post="post" />

    <!-- 貼文內容 -->
    <div class="post-content">
      <p class="post-text">
        <template v-if="(post.description || '').length < 80">{{ post.shortDescription }}</template>
        <template v-else>
          {{ post.shortDescription }}
          <span @click="handlePostClick">...查看更多</span>
        </template>
      </p>
    </div>

    <!-- 標籤區 -->
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
</template>

<script setup>
import TheAvatar from '@/components/common/TheAvatar.vue'
import PostActions from '@/components/post/PostActions.vue'

import { ref } from 'vue'
import { usePostStore } from '@/stores/modules/postStore'
import { useModalStore } from '@/stores/modules/modalStore'
import { useToastStore } from '@/stores/modules/toastStore'
import { useUserStore } from '@/stores/modules/userStore'
import { formatTimeAgo } from '@/utils/postUtils'
import { useRouter } from 'vue-router'

const postStore = usePostStore()
const modalStore = useModalStore()
const toastStore = useToastStore()
const userStore = useUserStore()
const router = useRouter()

const showHeart = ref(false) // 用於控制愛心圖標顯示
const heartPosition = ref({ x: 0, y: 0 }) // 用於記錄點擊位置

const props = defineProps({
  post: {
    type: Object,
    default: {},
  },
})

const goToUserProfile = () => {
  if (!props?.post?.user || !props?.post?.user?.id) {
    toastStore.showError('用戶資訊不完整，無法跳轉到個人主頁')
    return
  }

  router.push(`/profile/${props.post.user.id}`)
}

// 處理點擊標籤事件
const handleTagClick = (tag) => {
  // 消除 # 前綴
  const keyword = tag.startsWith('#') ? tag.slice(1) : tag
  if (keyword) {
    router.push({ name: 'search_result', query: { keyword } })
  }
}

// 處理點擊圖片按讚事件
const handleImageClick = async (event) => {
  if (props.post.likedByMe) return

  try {
    // 記錄滑鼠點擊的位置
    const rect = event.currentTarget.getBoundingClientRect()
    heartPosition.value = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }

    await postStore.toggleLikePost(props.post.id)
    showHeart.value = true

    // 1秒後隱藏愛心圖標
    setTimeout(() => {
      showHeart.value = false
    }, 1000)
  } catch (error) {
    toastStore.showError('按讚失敗，請稍後再試')
  }
}

const handlePostClick = () => {
  postStore.setCurrentPostId(props.post.id)
  modalStore.openModal('postDetails')
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.post-item {
  background: $surface;
  border-radius: 12px;
  box-shadow: 0 2px 10px $shadow-light;
  overflow: hidden;
  border: 1px solid $border-color;
  transition: box-shadow $transition-speed ease;

  &:hover {
    box-shadow: 0 4px 20px $shadow-light;
  }
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid $border-light;
}

.user-info {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
}

.username {
  font-weight: 600;
  color: $text-color;
  font-size: 14px;
}

.post-time {
  color: $text-secondary;
  font-size: 13px;
}

.post-image {
  width: 100%;
  height: 370px;
  overflow: hidden;
  position: relative;
  background-color: $surface-alt;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
    transition: transform 0.3s ease;
  }

  .liked-icon {
    position: absolute;
    transform: translate(-50%, -50%) scale(1); // 保持居中對齊
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

.post-content {
  padding: 16px;
}

.post-text {
  color: $text-color;
  line-height: 1.5;
  font-size: 14px;
  margin: 0;

  span {
    cursor: pointer;
    color: $primary-color;
    font-size: 14px;
    line-height: 1.5;
    margin-left: 2px;
    position: relative;
    text-decoration: none;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 1px;
      background-color: $primary-color;
      transition: width $transition-speed ease;
    }

    &:hover::after {
      width: 100%;
    }
  }
}

.post-tags {
  padding: 0 16px 16px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background-color: rgba(var(--primary-color-rgb), 0.1);
  color: $primary-color;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color $transition-speed ease;

  &:hover {
    background-color: rgba(var(--primary-color-rgb), 0.2);
  }
}

@media (max-width: $mobile-breakpoint) {
  .post-item {
    border-radius: 8px;
  }

  .post-header {
    padding: 12px;
  }

  .post-content {
    padding: 12px;
  }

  .post-image {
    height: 300px;
  }

  .post-tags {
    padding: 0 12px 12px;
  }

  .action-icons {
    gap: 16px;
  }

  .icon-item {
    padding: 6px 8px;

    i {
      font-size: 18px;
    }
  }
}
</style>
