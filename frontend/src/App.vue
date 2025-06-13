<template>
  <header>
    <NavBar @open-post-upload="openPostUpload" />
  </header>

  <main>
    <router-view></router-view>
  </main>

  <!-- 貼文上傳彈跳視窗 -->
  <PostUpload v-if="showPostUpload" @close="closePostUpload" />
</template>

<script setup>
import { ref } from 'vue'
import NavBar from '@/components/layout/NavBar.vue'
import PostUpload from '@/components/post/PostUpload.vue'

// 控制彈跳視窗顯示狀態
const showPostUpload = ref(false)

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
