<template>
  <section>
    <PostList :isEmpty="posts.length === 0 && !isLoading" :isLoading="isLoading">
      <!-- 魚骨狀加載骨架 -->
      <template v-if="isLoading">
        <div class="skeleton-post" v-for="(n, index) in 12" :key="index">
          <!-- 用戶資訊骨架 -->
          <div class="skeleton-header">
            <div class="skeleton skeleton-avatar"></div>
            <div class="skeleton-user-info">
              <div class="skeleton skeleton-username"></div>
              <div class="skeleton skeleton-time"></div>
            </div>
          </div>

          <!-- 圖片骨架 -->
          <div class="skeleton skeleton-image"></div>

          <!-- 互動按鈕骨架 -->
          <div class="skeleton-actions">
            <div class="skeleton skeleton-action-btn"></div>
            <div class="skeleton skeleton-action-btn"></div>
            <div class="skeleton skeleton-action-btn"></div>
          </div>

          <!-- 內容骨架 -->
          <div class="skeleton-content">
            <div class="skeleton skeleton-text-line"></div>
            <div class="skeleton skeleton-text-line short"></div>
          </div>

          <!-- 標籤骨架 -->
          <div class="skeleton-tags">
            <div class="skeleton skeleton-tag"></div>
            <div class="skeleton skeleton-tag"></div>
            <div class="skeleton skeleton-tag"></div>
          </div>
        </div>
      </template>

      <template v-if="posts.length > 0">
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
      </template>

      <template v-else-if="!isLoading">
        <div class="no-posts-message">
          <p>目前還沒有貼文喔！快來分享您的生活吧！</p>
        </div>
      </template>
    </PostList>
  </section>
</template>

<script setup>
import PostCard from '@/components/post/PostCard.vue'
import PostList from '@/components/post/PostList.vue'

import { ref, computed, onMounted } from 'vue'
import { usePostStore } from '@/stores/modules/postStore'

const postStore = usePostStore()
const isLoading = ref(true)

const posts = computed(() => postStore.list)

onMounted(async () => {
  try {
    await postStore.loadAllPosts()
  } finally {
    isLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.no-posts-message {
  text-align: center;
  color: $text-secondary;
  font-size: 16px;
  font-weight: 600;
  margin-top: 20px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: $shadow-light;

  p {
    margin: 0;
    line-height: 1.5;
  }
}

// 魚骨狀加載骨架樣式
.skeleton-post {
  background: $surface;
  border-radius: 12px;
  box-shadow: 0 2px 10px $shadow-light;
  overflow: hidden;
  border: 1px solid $border-color;
  margin-bottom: 20px;
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid $border-light;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skeleton-username {
  height: 16px;
  width: 120px;
}

.skeleton-time {
  height: 12px;
  width: 80px;
}

.skeleton-image {
  height: 370px;
  width: 100%;
}

.skeleton-actions {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid $border-light;
}

.skeleton-action-btn {
  height: 24px;
  width: 60px;
  border-radius: 12px;
}

.skeleton-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-text-line {
  height: 14px;
  border-radius: 4px;

  &.short {
    width: 60%;
  }
}

.skeleton-tags {
  padding: 0 16px 16px;
  display: flex;
  gap: 8px;
}

.skeleton-tag {
  height: 24px;
  width: 60px;
  border-radius: 12px;
}

// 基礎骨架樣式
.skeleton {
  background: linear-gradient(90deg, $surface-alt 25%, $background 50%, $surface-alt 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite ease-in-out;
  border-radius: 4px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: $mobile-breakpoint) {
  .skeleton-post {
    border-radius: 8px;
  }

  .skeleton-header {
    padding: 12px;
  }

  .skeleton-content {
    padding: 12px;
  }

  .skeleton-image {
    height: 300px;
  }

  .skeleton-tags {
    padding: 0 12px 12px;
  }
}
</style>
