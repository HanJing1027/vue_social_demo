<template>
  <section>
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

<style lang="scss" scoped></style>
