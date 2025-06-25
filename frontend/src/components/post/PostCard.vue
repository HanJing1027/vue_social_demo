<template>
  <div class="post-item">
    <!-- 用戶資訊區 -->
    <div class="post-header">
      <div class="user-info">
        <TheAvatar :src="post.user?.avatar" :width="40" :height="40" :fontSize="20" />
        <span class="username">{{ post.user?.name || post.user?.username }}</span>
      </div>
      <span class="post-time">{{ formatTimeAgo(post.createdAt) }}</span>
    </div>

    <!-- 貼文圖片 -->
    <div class="post-image">
      <img :src="post.image" alt="貼文圖片" />
    </div>

    <!-- 互動按鈕區 -->
    <PostActions />

    <!-- 貼文內容 -->
    <div class="post-content">
      <p class="post-text">
        {{ post.shortDescription }}
      </p>
    </div>

    <!-- 標籤區 -->
    <div class="post-tags">
      <span v-for="(tag, index) in post.tags" :key="index" class="tag">{{ tag }}</span>
    </div>
  </div>
</template>

<script setup>
import TheAvatar from '@/components/common/TheAvatar.vue'
import PostActions from '@/components/post/PostActions.vue'

import { formatTimeAgo } from '@/utils/postUtils'

const props = defineProps({
  post: {
    type: Object,
    default: {},
  },
})
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
}

.post-image img {
  width: 100%;
  height: auto;
  display: block;
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
