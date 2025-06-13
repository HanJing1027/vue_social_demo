<template>
  <div class="content">
    <div class="post-list">
      <PostCard v-for="i in 5" :key="i" @openDetails="openPostDetails" />
    </div>
  </div>

  <PostDetails v-if="showPostDetails" @close="closePostDetails" />
</template>

<script setup>
import PostCard from '@/components/PostCard.vue'
import PostDetails from '@/components/PostDetails.vue'
import { ref, watch } from 'vue'

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
import { onUnmounted } from 'vue'
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.content {
  max-width: 1200px;
  margin: 80px auto 30px;
  padding: 20px;
}

.post-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (max-width: $mobile-breakpoint) {
  .content {
    padding: 10px;
  }

  .post-list {
    grid-template-columns: 1fr;
  }
}
</style>
