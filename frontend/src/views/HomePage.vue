<template>
  <section>
    <PostList>
      <PostCard v-for="i in 5" :key="i" />
      <button @click="test">test</button>
    </PostList>
  </section>
</template>

<script setup>
import PostCard from '@/components/post/PostCard.vue'
import PostList from '@/components/post/PostList.vue'

import { usePostStore } from '@/stores/modules/postStore'

const postStore = usePostStore()

const test = async () => postStore.loadPosts()
</script>

<style lang="scss" scoped></style>
