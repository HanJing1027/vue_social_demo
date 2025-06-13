<template>
  <header>
    <NavBar @open-post-upload="openPostUpload" />
  </header>

  <TheLayout>
    <router-view></router-view>
  </TheLayout>

  <!-- 貼文上傳彈跳視窗 -->
  <PostUpload v-if="showPostUpload" @close="closePostUpload" />
</template>

<script setup>
import { ref, watch } from 'vue'
import TheLayout from './components/layout/TheLayout.vue'
import NavBar from '@/components/layout/NavBar.vue'
import PostUpload from '@/components/post/PostUpload.vue'

// 控制彈跳視窗顯示狀態
const showPostUpload = ref(false)

watch(showPostUpload, (newValue) => {
  if (newValue) {
    // 打開彈跳視窗時禁止滾動
    document.body.style.overflow = 'hidden'
  } else {
    // 關閉彈跳視窗時恢復滾動
    document.body.style.overflow = ''
  }
})

// 打開貼文上傳彈跳視窗
const openPostUpload = () => {
  showPostUpload.value = true
}

// 關閉貼文上傳彈跳視窗
const closePostUpload = () => {
  showPostUpload.value = false
}
</script>

<style lang="scss" scoped></style>
