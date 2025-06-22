<template>
  <section>
    <PostList>
      <PostCard v-for="i in 5" :key="i" />
    </PostList>
  </section>
</template>

<script setup>
import PostCard from '@/components/post/PostCard.vue'
import PostList from '@/components/post/PostList.vue'
</script>

<style lang="scss" scoped></style>
