<template>
  <section>
    <h2 class="search-title">
      搜尋結果：
      <span>{{ keyword }}</span>
    </h2>
    <PostList>
      <PostCard v-for="post in searchResultList" :post="post" :key="post.id" />
    </PostList>
  </section>
</template>

<script setup>
import PostCard from '@/components/post/PostCard.vue'
import PostList from '@/components/post/PostList.vue'

import { ref, computed, onMounted } from 'vue'
import { usePostStore } from '@/stores/modules/postStore'
import { useRoute } from 'vue-router'

const postStore = usePostStore()
const route = useRoute()

const searchResultList = computed(() => postStore.searchResult || [])
const keyword = computed(() => route.query.keyword)

onMounted(() => {
  if (!keyword.value) {
    route.replace({ name: 'home' })
  } else {
    postStore.searchPostsResult(keyword.value)
  }

  postStore.loadAllPosts()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;

.search-title {
  cursor: default;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 1.5rem 0 3rem;
  color: $text-color;
  position: relative;

  span {
    color: $primary-color;
  }

  // 簡潔的底部線條
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: $primary-color;
    border-radius: 2px;
  }

  // 響應式設計
  @media (max-width: 768px) {
    margin: 1.5rem 0 2.5rem;

    &::after {
      width: 45px;
      height: 2px;
    }
  }

  @media (max-width: 480px) {
    margin: 1rem 0 2rem;

    &::after {
      width: 35px;
    }
  }
}
</style>
