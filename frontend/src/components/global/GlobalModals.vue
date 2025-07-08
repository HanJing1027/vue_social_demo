<template>
  <div class="global-modals">
    <!-- 貼文相關模態視窗 -->
    <PostUpload v-if="modalStore.modals.postUpload" />
    <PostDetails v-if="modalStore.modals.postDetails" />

    <!-- 通用模態視窗 -->
    <TheConfirmDeleteModal />

    <!-- 全域通知 -->
    <TheToast />
  </div>
</template>

<script setup>
import PostUpload from '@/components/post/PostUpload.vue'
import PostDetails from '@/components/post/PostDetails.vue'
import TheToast from '@/components/common/TheToast.vue'
import TheConfirmDeleteModal from '@/components/common/TheConfirmDeleteModal.vue'

import { useModalStore } from '@/stores/modules/modalStore'

const modalStore = useModalStore()
</script>

<style lang="scss" scoped></style>
