<template>
  <section>
    <h2 class="search-title">搜尋結果：植物</h2>
    <PostList>
      <PostCard v-for="i in 5" :key="i" @openDetails="openPostDetails" />
    </PostList>
  </section>

  <PostDetails v-if="showPostDetails" @close="closePostDetails" />
</template>

<script setup>
import PostCard from '@/components/post/PostCard.vue'
import PostDetails from '@/components/post/PostDetails.vue'
import PostList from '@/components/post/PostList.vue'
import { ref, watch, onUnmounted } from 'vue'

// 控制 PostDetails 顯示狀態
const showPostDetails = ref(false)

// 開啟貼文詳情
const openPostDetails = () => {
  showPostDetails.value = true
}

// 關閉貼文詳情
const closePostDetails = () => {
  showPostDetails.value = false
}

// 監聽 PostDetails 顯示狀態，控制頁面滾動
watch(showPostDetails, (newValue) => {
  if (newValue) {
    // 顯示 PostDetails 時禁用滾動
    document.body.style.overflow = 'hidden'
  } else {
    // 隱藏 PostDetails 時恢復滾動
    document.body.style.overflow = ''
  }
})

// 組件卸載時確保恢復滾動
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;

.search-title {
  cursor: default;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 1.5rem 0 3rem;
  color: $text-color;
  position: relative;

  // 簡潔的底部線條
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: $primary-color;
    border-radius: 2px;
  }

  // 響應式設計
  @media (max-width: 768px) {
    margin: 1.5rem 0 2.5rem;

    &::after {
      width: 45px;
      height: 2px;
    }
  }

  @media (max-width: 480px) {
    margin: 1rem 0 2rem;

    &::after {
      width: 35px;
    }
  }
}
</style>
