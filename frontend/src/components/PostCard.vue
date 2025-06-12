<template>
  <div class="post-item">
    <!-- 用戶資訊區 -->
    <div class="post-header">
      <div class="user-info">
        <img src="https://picsum.photos/40?blur=2" alt="用戶頭貼" class="avatar" />
        <span class="username">用戶名稱</span>
      </div>
      <span class="post-time">2小時前</span>
    </div>

    <!-- 貼文圖片 -->
    <div class="post-image">
      <img src="https://picsum.photos/500/300?blur=2" alt="貼文圖片" />
    </div>

    <!-- 互動按鈕區 -->
    <div class="post-actions">
      <div class="action-icons">
        <div class="icon-item heart-action" :class="{ active: isLiked }" @click="toggleLike">
          <i :class="isLiked ? 'bxs-heart' : 'bx-heart'" class="bx"></i>
          <span class="action-count">{{ likeCount }}</span>
        </div>
        <div class="icon-item comment-action">
          <i class="bx bx-message-square"></i>
          <span class="action-count">{{ commentCount }}</span>
        </div>
        <div class="icon-item star-action" :class="{ active: isSaved }" @click="toggleSave">
          <i :class="isSaved ? 'bxs-star' : 'bx-star'" class="bx"></i>
          <span class="action-count">{{ saveCount }}</span>
        </div>
      </div>
    </div>

    <!-- 貼文內容 -->
    <div class="post-content">
      <p class="post-text">
        這是一篇範例貼文的內容，可以包含多行文字。用戶可以在這裡分享他們的想法、經歷或任何有趣的內容。
      </p>
    </div>

    <!-- 標籤區 -->
    <div class="post-tags">
      <span class="tag">#旅行</span>
      <span class="tag">#美食</span>
      <span class="tag">#生活</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 定義響應式狀態
const isLiked = ref(false)
const isSaved = ref(false)
const likeCount = ref(128)
const commentCount = ref(24)
const saveCount = ref(56)

// 按讚功能
const toggleLike = () => {
  isLiked.value = !isLiked.value
  likeCount.value += isLiked.value ? 1 : -1
}

// 收藏功能
const toggleSave = () => {
  isSaved.value = !isSaved.value
  saveCount.value += isSaved.value ? 1 : -1
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
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  font-weight: 600;
  color: $text-color;
  font-size: 14px;
}

.post-time {
  color: $text-secondary;
  font-size: 12px;
}

/* 貼文圖片 */
.post-image {
  width: 100%;
}

.post-image img {
  width: 100%;
  height: auto;
  display: block;
}

.post-actions {
  padding: 12px 16px;
  border-bottom: 1px solid $border-light;
}

.action-icons {
  display: flex;
  gap: 24px;
}

.icon-item {
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all $transition-speed ease;
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  user-select: none;

  &:hover {
    background-color: $surface-hover;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0px) scale(0.95);
  }

  i {
    font-size: 23px;
    transition: all $transition-speed ease;
  }

  .action-count {
    font-size: 12px;
    font-weight: 500;
    color: $text-secondary;
    transition: color $transition-speed ease;
    min-width: 20px;
  }
}

/* 愛心按鈕 */
.heart-action {
  i {
    color: $text-secondary;
  }

  &:hover {
    background-color: rgba(220, 53, 69, 0.1);

    i {
      color: $danger-color;
      transform: scale(1.1);
    }

    .action-count {
      color: $danger-color;
    }
  }

  &.active {
    i {
      color: $danger-color;
      animation: heartBeat 0.6s ease-in-out;
    }

    .action-count {
      color: $danger-color;
      font-weight: 600;
    }
  }
}

/* 留言按鈕 */
.comment-action {
  i {
    color: $text-secondary;
  }

  &:hover {
    background-color: rgba(var(--primary-color-rgb), 0.1);

    i {
      color: $primary-color;
      transform: scale(1.1);
    }

    .action-count {
      color: $primary-color;
    }
  }
}

/* 星星按鈕 */
.star-action {
  i {
    color: $text-secondary;
  }

  &:hover {
    background-color: rgba(243, 156, 18, 0.1);

    i {
      color: #f39c12;
      transform: scale(1.1);
    }

    .action-count {
      color: #f39c12;
    }
  }

  &.active {
    i {
      color: #f39c12;
      animation: starGlow 0.6s ease-in-out;
    }

    .action-count {
      color: #f39c12;
      font-weight: 600;
    }
  }
}

/* 動畫效果 */
@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.3);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.3);
  }
  70% {
    transform: scale(1);
  }
}

@keyframes starGlow {
  0% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(180deg);
  }
  100% {
    transform: scale(1) rotate(360deg);
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
