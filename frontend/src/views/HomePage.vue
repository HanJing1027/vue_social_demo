<template>
  <section>
    <PostList :isEmpty="posts.length === 0">
      <template v-if="posts.length > 0">
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
      </template>

      <template v-else>
        <div class="no-posts-message">
          <p>目前還沒有貼文喔！快來分享您的生活吧！</p>
        </div>
      </template>
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

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.no-posts-message {
  text-align: center;
  color: $text-secondary;
  font-size: 16px;
  font-weight: 600;
  margin-top: 20px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: $shadow-light;

  p {
    margin: 0;
    line-height: 1.5;
  }
}
</style>
