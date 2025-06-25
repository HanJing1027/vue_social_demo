<template>
  <section>
    <PostList>
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </PostList>
  </section>
</template>

<script setup>
import PostCard from '@/components/post/PostCard.vue'
import PostList from '@/components/post/PostList.vue'

import { onMounted, computed } from 'vue'
import { usePostStore } from '@/stores/modules/postStore'

const postStore = usePostStore()

const posts = computed(() => postStore.list)

onMounted(() => {
  postStore.loadAllPosts()
})
</script>

<style lang="scss" scoped></style>
