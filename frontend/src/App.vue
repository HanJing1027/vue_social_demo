<template>
  <template v-if="$route.path !== '/login'">
    <header>
      <NavBar />
    </header>

    <TheLayout>
      <router-view></router-view>
    </TheLayout>
  </template>

  <template v-else>
    <router-view></router-view>
  </template>

  <footer>
    <Footer />
  </footer>

  <!-- 貼文上傳彈跳視窗 -->
  <PostUpload v-if="modalStore.modals.postUpload" />
  <TheToast />
</template>

<script setup>
import TheLayout from './components/layout/TheLayout.vue'
import NavBar from '@/components/layout/NavBar.vue'
import Footer from './components/layout/Footer.vue'
import PostUpload from '@/components/post/PostUpload.vue'
import TheToast from '@/components/common/TheToast.vue'

import { useModalStore } from '@/stores/modules/modalStore'

const modalStore = useModalStore()
</script>

<style lang="scss" scoped></style>
